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
  DOCUMENT_UNSHARE_FORBIDDEN_WRONG_PASSCODE,
  DOCUMENT_VIEW_FORBIDDEN,
  DOCUMENT_VIEW_FORBIDDEN_WRONG_PASSCODE,
  NOT_PREMIUM_USER,
  UNAUTHORIZED,
} from "../shared/error";
import DocumentService from "../services/document.service";
import { AppUserTypeEnum } from "../models/account";

type GetDocumentOverviewRequest = RequestHandlerWithType<any, PaginationOption>;

const getDocuments: GetDocumentOverviewRequest = async (req, res, next) => {
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

type SaveDocumentRequest = RequestHandlerWithType<
  {
    content: string;
    title: string;
  },
  any,
  { documentId: string }
>;

const saveDocument: SaveDocumentRequest = async (req, res, next) => {
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

type CreateDocumentRequest = RequestHandlerWithType<{
  title: string;
  content: string;
}>;

const createDocument: CreateDocumentRequest = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      throw new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED, true);
    }

    const numberOfDocuments = await DocumentModel.count({
      ownerId: req.user._id,
    });

    if (numberOfDocuments !== 0 && req.user.type !== AppUserTypeEnum.PREMIUM) {
      throw new ApiError(httpStatus.FORBIDDEN, NOT_PREMIUM_USER, true);
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

type GetDocumentRequest = RequestHandlerWithType<
  any,
  any,
  { documentId: string }
>;

const getDocumentById: GetDocumentRequest = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED, true);
    }

    const { documentId } = req.params;

    // NOTE: get document by id
    const documentDetail = await DocumentModel.findOne({
      _id: documentId,
    });

    if (!documentDetail) {
      throw new ApiError(httpStatus.NOT_FOUND, DOCUMENT_NOT_FOUND, true);
    }

    const isOwner = req.user._id === documentDetail.ownerId.toString();

    if (!isOwner) {
      throw new ApiError(httpStatus.FORBIDDEN, DOCUMENT_VIEW_FORBIDDEN, true);
    }

    res
      .status(httpStatus.OK)
      .json(createResponse({ document: documentDetail }));
  } catch (e) {
    next(e);
  }
};

type ShareDocumentRequest = RequestHandlerWithType<
  {
    passcode: string;
  },
  any,
  { documentId: string }
>;

const shareDocument: ShareDocumentRequest = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED, true);
    }

    const { documentId } = req.params;

    const { passcode } = req.body;

    const targetDocument = await DocumentModel.findOne({
      _id: documentId,
    });

    if (!targetDocument) {
      throw new ApiError(httpStatus.NOT_FOUND, DOCUMENT_NOT_FOUND, true);
    }

    const isOwner = req.user._id === targetDocument.ownerId.toString();

    if (!isOwner) {
      throw new ApiError(httpStatus.FORBIDDEN, DOCUMENT_VIEW_FORBIDDEN, true);
    }

    if (targetDocument.isShared) {
      throw new ApiError(httpStatus.CONFLICT, DOCUMENT_ALREADY_SHARED, true);
    }

    targetDocument.isShared = true;

    targetDocument.passcode = passcode;

    await targetDocument.save();

    delete targetDocument.passcode;

    res
      .status(httpStatus.OK)
      .json(createResponse({ document: targetDocument }));
  } catch (e) {
    next(e);
  }
};

type CanViewDocumentRequest = RequestHandlerWithType<
  { passcode: string },
  any,
  { documentId: string }
>;

const canViewDocument: CanViewDocumentRequest = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED, true);
    }

    const { documentId } = req.params;

    const { passcode } = req.body;

    // NOTE: get document by id
    const documentDetail = await DocumentModel.findOne({
      _id: documentId,
    });

    if (!documentDetail) {
      throw new ApiError(httpStatus.NOT_FOUND, DOCUMENT_NOT_FOUND, true);
    }

    const isOwner = req.user._id === documentDetail.ownerId.toString();

    if (!documentDetail.isShared && !isOwner) {
      throw new ApiError(httpStatus.FORBIDDEN, DOCUMENT_VIEW_FORBIDDEN, true);
    }

    const document = await DocumentService.canUserViewDocument(
      documentDetail,
      req.user._id,
      passcode
    );

    if (!document) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        DOCUMENT_VIEW_FORBIDDEN_WRONG_PASSCODE,
        true
      );
    }

    res.status(httpStatus.OK).json(createResponse({ document }));
  } catch (e) {
    next(e);
  }
};

type UnShareDocumentRequest = RequestHandlerWithType<
  { passcode: string },
  any,
  { documentId: string }
>;

const unShareDocument: UnShareDocumentRequest = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED, true);
    }

    const { documentId } = req.params;

    const { passcode } = req.body;

    const targetDocument = await DocumentModel.findOne({
      _id: documentId,
    });

    if (!targetDocument) {
      throw new ApiError(httpStatus.NOT_FOUND, DOCUMENT_NOT_FOUND, true);
    }

    const isOwner = req.user._id === targetDocument.ownerId.toString();

    if (!isOwner) {
      throw new ApiError(httpStatus.FORBIDDEN, DOCUMENT_VIEW_FORBIDDEN, true);
    }

    const isPasscodeValid = await targetDocument.comparePasscode(passcode);

    if (!isPasscodeValid) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        DOCUMENT_UNSHARE_FORBIDDEN_WRONG_PASSCODE,
        true
      );
    }

    targetDocument.isShared = false;

    targetDocument.passcode = undefined;

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
  canViewDocument,
  unShareDocument,
};
