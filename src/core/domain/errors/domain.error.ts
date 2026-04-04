export class AppError extends Error {
    public readonly statusCode: number;
    public readonly type: string;

    constructor(message: string, statusCode = 400, type = 'UNKNOWN') {
        super(message);
        this.statusCode = statusCode;
        this.type = type;
        this.name = 'AppError';
    }
}
