import httpStatus from "http-status";
import { createResponse } from "../utils/response";
import DocumentService from "../services/document.service";
import DocumentUtil from "../utils/document";
import PasswordUtil from "../utils/password";
import { paginate } from "../utils/pagination";
import ApiError from "../utils/api-error";
import {
  DOCUMENT_ALREADY_SHARED,
  DOCUMENT_CREATE_FAILED,
  DOCUMENT_NOT_FOUND,
  DOCUMENT_UNSHARE_FORBIDDEN_WRONG_PASSCODE,
  DOCUMENT_UPDATE_FAILED,
  DOCUMENT_VIEW_FORBIDDEN,
  DOCUMENT_VIEW_FORBIDDEN_WRONG_PASSCODE,
  NOT_PREMIUM_USER,
  UNAUTHORIZED,
} from "../shared/error";
import type {
  PaginationOption,
  RequestHandlerWithType,
} from "../shared/request-type";
import { AppUserType } from "../types/user-type";

type GetDocumentOverviewRequest = RequestHandlerWithType<any, PaginationOption>;

const getDocuments: GetDocumentOverviewRequest = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED, true);
    }

    const { page, pageSize } = req.query;

    const offset = paginate(page, pageSize);

    const documents = await DocumentService.getAllUserDocuments(req.user._id, {
      offset,
      pageSize,
    });

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

    const targetDocument = await DocumentService.getDocumentById(documentId);

    if (!targetDocument) {
      throw new ApiError(httpStatus.NOT_FOUND, DOCUMENT_NOT_FOUND, true);
    }

    const newWordsCount = DocumentUtil.countContentWords(newContent);

    const updatedDocumentPayload = {
      ...targetDocument,
      title: newTitle,
      content: newContent,
      words: newWordsCount,
      updatedBy: req.user._id,
    };

    const updatedDocument = await DocumentService.updateDocument(
      updatedDocumentPayload
    );

    if (!updatedDocument) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        DOCUMENT_UPDATE_FAILED,
        false
      );
    }

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

    const documents = await DocumentService.getAllUserDocuments(req.user._id);

    if (documents?.length !== 0 && req.user.type !== AppUserType.PREMIUM) {
      throw new ApiError(httpStatus.FORBIDDEN, NOT_PREMIUM_USER, true);
    }

    const { content, title } = req.body;

    const newWordsCount = DocumentUtil.countContentWords(content);

    const payload = {
      title: title,
      words: newWordsCount,
      content: content,
      ownerId: req.user._id,
    };

    const createdDocument = await DocumentService.createDocument(payload);

    if (!createdDocument) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        DOCUMENT_CREATE_FAILED,
        false
      );
    }

    res
      .status(httpStatus.CREATED)
      .json(createResponse({ document: createdDocument }));
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

    const documentDetail = await DocumentService.getDocumentById(documentId);

    if (!documentDetail) {
      throw new ApiError(httpStatus.NOT_FOUND, DOCUMENT_NOT_FOUND, true);
    }

    const isOwner = req.user?._id === documentDetail.ownerId;

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

    const targetDocument = await DocumentService.getDocumentById(documentId);

    if (!targetDocument) {
      throw new ApiError(httpStatus.NOT_FOUND, DOCUMENT_NOT_FOUND, true);
    }

    const isOwner = req.user?._id === targetDocument.ownerId;

    if (!isOwner) {
      throw new ApiError(httpStatus.FORBIDDEN, DOCUMENT_VIEW_FORBIDDEN, true);
    }

    if (targetDocument.isShared) {
      throw new ApiError(httpStatus.CONFLICT, DOCUMENT_ALREADY_SHARED, true);
    }

    const updatePayload = { ...targetDocument, passcode, isShared: true };

    const updatedDocument = await DocumentService.updateDocument(updatePayload);

    if (!updatedDocument) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        DOCUMENT_UPDATE_FAILED,
        false
      );
    }

    delete updatedDocument?.passcode;

    res
      .status(httpStatus.OK)
      .json(createResponse({ document: updatedDocument }));
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
    const { documentId } = req.params;

    const { passcode } = req.body;

    // NOTE: get document by id
    const documentDetail = await DocumentService.getDocumentById(documentId);

    if (!documentDetail) {
      throw new ApiError(httpStatus.NOT_FOUND, DOCUMENT_NOT_FOUND, true);
    }

    const isOwner = req.user?._id === documentDetail.ownerId.toString();

    if (!documentDetail.isShared && !isOwner) {
      throw new ApiError(httpStatus.FORBIDDEN, DOCUMENT_VIEW_FORBIDDEN, true);
    }

    const document = await DocumentService.canUserViewDocument(
      documentDetail,
      req.user?._id,
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

    const targetDocument = await DocumentService.getDocumentById(documentId);

    if (!targetDocument) {
      throw new ApiError(httpStatus.NOT_FOUND, DOCUMENT_NOT_FOUND, true);
    }

    const isOwner = req.user._id === targetDocument.ownerId;

    if (!isOwner) {
      throw new ApiError(httpStatus.FORBIDDEN, DOCUMENT_VIEW_FORBIDDEN, true);
    }

    const isPasscodeValid = await PasswordUtil.isPasswordMatch(
      passcode,
      targetDocument.passcode ?? ""
    );

    if (!isPasscodeValid) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        DOCUMENT_UNSHARE_FORBIDDEN_WRONG_PASSCODE,
        true
      );
    }

    const updatePayload = {
      ...targetDocument,
      passcode: undefined,
      isShared: false,
    };

    const updatedDocument = await DocumentService.updateDocument(updatePayload);

    if (!updatedDocument) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        DOCUMENT_UPDATE_FAILED,
        false
      );
    }

    res
      .status(httpStatus.OK)
      .json(createResponse({ document: updatedDocument }));
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
