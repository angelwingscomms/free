import { id_prefix } from "$lib/constants";
import { client } from "./redis";

export const get_id = async () => `${id_prefix}${await client.incr('last_id')}`;