import * as dotenv from 'dotenv';

dotenv.config();

const { TOKEN, DB_PATH } = process.env;

const ADMIN_ID = Number(process.env.ADMIN_ID);

export { TOKEN, ADMIN_ID, DB_PATH };
