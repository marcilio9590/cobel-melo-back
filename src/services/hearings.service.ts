import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PaginateModel } from 'mongoose-paginate-v2';
import { CreateHearingDTO } from "../dtos/create-hearing.dto";
import { HearingDocument } from "../schemas/hearing.schema";

@Injectable()
export class HearingService {

  constructor(
    @InjectModel('Hearing') private readonly hearingModel: PaginateModel<HearingDocument>
  ) { }

  async create(createHearingDTO: CreateHearingDTO) {
    let response;
    try {
      const createdHearing = await new this.hearingModel(createHearingDTO);
      response = await createdHearing.save()
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
    await this.hearingModel.remove({ _id: id }, function (err) {
      if (!err) {
        return;
      }
      else {
        console.error("Ocorreu um erro ao processar sua requisição", err);
        throw err;
      }
    });
  }

}