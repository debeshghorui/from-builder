import UserService from "@repo/services/user";
import FormService from "@repo/services/form";
import FormFieldsService from "@repo/services/form-fields";

export const userService = new UserService();
export const formService = new FormService();
export const formFieldsService = new FormFieldsService();
