import * as dotenv from "dotenv";
dotenv.config();

const { BOT_TOKEN, CLIENT_ID, GUILD_ID, TRANSFERT_CHANNEL_ID } = process.env;
const MEME_FOLDER = "memes";

export { BOT_TOKEN, CLIENT_ID, GUILD_ID, MEME_FOLDER, TRANSFERT_CHANNEL_ID };
