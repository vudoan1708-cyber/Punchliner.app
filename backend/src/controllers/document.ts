import httpStatus from "http-status";
import type {
  PaginationOption,
  RequestHandlerWithType,
} from "../shared/request-type";
import { createResponse } from "../utils/response";
import DocumentModel from "../models/document";
import { paginate } from "../utils/pagination";
import ApiError from "../utils/api-error";
import { UNAUTHORIZED } from "../shared/error-codes";
import DocumentService from "../services/document.service";

const getDocuments: RequestHandlerWithType<any, PaginationOption> = async (
  req,
  res,
  next
) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED, true);
    }

    const { page, pageSize } = req.query;

    const queryOptions = paginate(page, pageSize);

    const documents = await DocumentModel.find(
      {
        ownerId: req.user._id,
      },
      null,
      queryOptions
    );

    res.status(httpStatus.OK).json(
      createResponse({ documents }, true, undefined, {
        page,
      })
    );
  } catch (e) {
    next(e);
  }
};

const saveDocument: RequestHandlerWithType<
  {
    content: string;
  },
  any,
  { documentId: string }
> = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED, true);
    }

    const { documentId } = req.params;

    const { content: newContent } = req.body;

    const words = DocumentService.countContentWords(newContent);

    const updatedDocument = await DocumentModel.findByIdAndUpdate(
      {
        _id: documentId,
      },
      {
        $set: {
          content: newContent,
          words,
        },
      }
    );

    res
      .status(httpStatus.OK)
      .json(createResponse({ document: updatedDocument }));
  } catch (e) {
    next(e);
  }
};

const createDocument: RequestHandlerWithType<{
  title: string;
  content: string;
}> = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED, true);
    }

    const { content, title } = req.body;

    const words = DocumentService.countContentWords(content);

    const newDocument = new DocumentModel({
      title: title,
      words: words,
      content: content,
      ownerId: req.user._id,
    });

    await newDocument.save();

    res
      .status(httpStatus.CREATED)
      .json(createResponse({ document: newDocument }));
  } catch (e) {
    next(e);
  }
};

const getDocumentById: RequestHandlerWithType<
  any,
  any,
  { documentId: string }
> = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED, true);
    }

    const { documentId } = req.params;

    const documentDetail = await DocumentModel.findOne({
      _id: documentId,
      ownerId: req.user._id,
    });

    res
      .status(httpStatus.OK)
      .json(createResponse({ document: documentDetail }));
  } catch (e) {
    next(e);
  }
};

export default { getDocuments, saveDocument, createDocument, getDocumentById };
