import { Inject, Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { PaginateModel } from 'mongoose-paginate-v2';
import { ProcessDocument } from "../schemas/process.schema";
import { CreateHearingDTO } from "../dtos/create-hearing.dto";
import { HearingDocument } from "../schemas/hearing.schema";

@Injectable()
export class HearingService {

  constructor(
    @Inject('HEARING_MODEL') private readonly hearingModel: PaginateModel<HearingDocument>,
    @Inject('PROCESS_MODEL') private readonly processModel: Model<ProcessDocument>
  ) { }

  async create(createHearingDTO: CreateHearingDTO) {
    let response;
    try {
      const createdHearing = await new this.hearingModel(createHearingDTO);
      response = await createdHearing.save();
      await this.processModel.findByIdAndUpdate(createHearingDTO.process, { $push: { hearings: response._id } });
    } catch (exception) {
      console.error("Ocorre um erro ao processua esta ação", exception);
      throw exception;
    }
    return response;
  }

  async paginate(page, size) {
    const options = {
      populate: 'customer process',
      page: page,
      limit: size,
    };
    try {
      return await this.hearingModel.paginate({}, options);
    } catch (error) {
      console.error("Ocorre um erro ao processua esta ação", error);
      throw error;

    }
  }

  async update(id: string, hearingDTO: CreateHearingDTO) {
    try {
      await this.hearingModel.findByIdAndUpdate(id, hearingDTO);
    } catch (error) {
      console.error("Ocorreu um erro ao processar sua requisição", error);
      throw error;
    }
  }

  async delete(id: string) {
    const ObjectId = (Types.ObjectId);
    try {
      const hearing = await this.hearingModel.findById(id).exec();
      await this.hearingModel.deleteOne({ _id: id }, function (err) {
        if (!err) {
          return;
        }
        else {
          throw err;
        }
      });
      await this.processModel.updateOne({ _id: hearing.process }, { $pullAll: { hearings: [new ObjectId(id)] } })
    } catch (error) {
      console.error("Ocorreu um erro ao processar sua requisição", error);
      throw error;
    }
  }

}