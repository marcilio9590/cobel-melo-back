import { Inject, Injectable } from "@nestjs/common";
import { PaginateModel } from 'mongoose-paginate-v2';
import { CreateProcessAreaDTO } from "../dtos/create-process-area.dto";
import { UpdateProcessAreaDTO } from "../dtos/update-process-area.dto";
import { ProcessAreaDocument } from "../schemas/process-area.schema";

@Injectable()
export class ProcessAreaService {

  constructor(
    @Inject('PROCESS_AREA_MODEL') private readonly processAreaModel: PaginateModel<ProcessAreaDocument>
  ) { }

  async create(createProcessAreaDTO: CreateProcessAreaDTO) {
    let response;
    try {
      const createdProcess = await new this.processAreaModel(createProcessAreaDTO);
      response = await createdProcess.save()
    } catch (exception) {
      console.error("Ocorre um erro ao processua esta ação", exception);
      throw exception;
    }
    return response;
  }

  async paginate(page, size) {
    const options = {
      page: page,
      limit: size,
    };
    try {
      return await this.processAreaModel.paginate({}, options);
    } catch (error) {
      console.error("Ocorre um erro ao processua esta ação", error);
      throw error;

    }
  }

  async getAllProcessAreas() {
    try {
      return await this.processAreaModel.find({}).exec();
    } catch (error) {
      console.error("Ocorre um erro ao processua esta ação", error);
      throw error;

    }
  }

  async update(updateProcessAreaDTO: UpdateProcessAreaDTO) {
    try {
      await this.processAreaModel.findByIdAndUpdate(updateProcessAreaDTO.id, updateProcessAreaDTO);
    } catch (error) {
      console.error("Ocorreu um erro ao processar sua requisição", error);
      throw error;
    }
  }
  async delete(id: string) {
    await this.processAreaModel.remove({ _id: id }, function (err) {
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