import httpStatus from "http-status";
import { Types } from "mongoose";
import type {
  PaginationOption,
  RequestHandlerWithType,
} from "../shared/request-type";
import { createResponse } from "../utils/response";
import DocumentModel from "../models/document";
import { paginate } from "../utils/pagination";
import ApiError from "../utils/api-error";
import {
  DOCUMENT_ALREADY_SHARED,
  DOCUMENT_NOT_FOUND,
  UNAUTHORIZED,
} from "../shared/error";
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
    title: string;
  },
  any,
  { documentId: string }
> = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      throw new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED, true);
    }

    const { documentId } = req.params;

    const { content: newContent, title: newTitle } = req.body;

    const targetDocument = await DocumentModel.findOne({
      _id: documentId,
    });

    if (!targetDocument) {
      throw new ApiError(httpStatus.NOT_FOUND, DOCUMENT_NOT_FOUND, true);
    }

    const words = DocumentService.countContentWords(newContent);

    targetDocument.content = newContent;
    targetDocument.words = words;
    targetDocument.title = newTitle;
    targetDocument.updatedBy = new Types.ObjectId(req.user._id);

    const updatedDocument = await targetDocument.save();

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

const shareDocument: RequestHandlerWithType<
  {
    passcode: string;
  },
  any,
  { documentId: string }
> = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED, true);
    }

    const { documentId } = req.params;

    const { passcode } = req.body;

    const targetDocument = await DocumentModel.findOne({
      _id: documentId,
      ownerId: req.user._id,
    });

    if (!targetDocument) {
      throw new ApiError(httpStatus.NOT_FOUND, DOCUMENT_NOT_FOUND, true);
    }

    if (targetDocument.isShared) {
      throw new ApiError(httpStatus.CONFLICT, DOCUMENT_ALREADY_SHARED, true);
    }

    targetDocument.isShared = true;

    targetDocument.passcode = passcode;

    await targetDocument.save();

    res
      .status(httpStatus.OK)
      .json(createResponse({ document: targetDocument }));
  } catch (e) {
    next(e);
  }
};

export default {
  getDocuments,
  saveDocument,
  shareDocument,
  createDocument,
  getDocumentById,
};
