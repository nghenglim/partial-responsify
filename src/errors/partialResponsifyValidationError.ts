import { PartialResponsifyValidationErrorCode } from "../lib/partialResponsify";
interface IPartialResponsifyValidationErrorObj {
    code: PartialResponsifyValidationErrorCode;
    dups?: string[];
    formatErrs?: any[];
}
export class PartialResponsifyValidationError extends Error {
    // TODO: add interface to obj in future
    public code: PartialResponsifyValidationErrorCode;
    public dups: string[];
    public formatErrs: any[];
    constructor(message: string, obj: IPartialResponsifyValidationErrorObj) {
        super(message);
        if (typeof obj !== "undefined") {
            if (typeof obj.code !== "undefined") {
                this.code = obj.code;
            }
            if (typeof obj.dups !== "undefined") {
                this.dups = obj.dups;
            }
            if (typeof obj.formatErrs !== "undefined") {
                this.formatErrs = obj.formatErrs;
            }
        }
        this.name = "PartialResponsifyValidationError";
    }
}
