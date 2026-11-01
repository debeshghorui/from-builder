import UserService from "@repo/services/user";
import FormService from "@repo/services/form";
import FormFieldsService from "@repo/services/form-fields";
import FormFlowService from "@repo/services/form-flow";
import FormResponsesService from "@repo/services/form-responses";
import FormAccessService from "@repo/services/form-access";

export const userService = new UserService();
export const formService = new FormService();
export const formFieldsService = new FormFieldsService();
export const formFlowService = new FormFlowService();
export const formResponsesService = new FormResponsesService();
export const formAccessService = new FormAccessService();
