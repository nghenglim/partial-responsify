import { PartialResponsifyValidationErrorCode } from "../lib/partialResponsify";
interface IPartialResponsifyValidationErrorObj {
    code: PartialResponsifyValidationErrorCode;
    dups?: string[];
    formatErrs?: any[];
}
export class PartialResponsifyValidationError extends Error {
    // TODO: add interface to obj in future
    public obj: IPartialResponsifyValidationErrorObj;
    constructor(message: string, obj: IPartialResponsifyValidationErrorObj) {
        super(message);
        this.obj = obj;
        this.name = "PartialResponsifyValidationError";
    }
}
