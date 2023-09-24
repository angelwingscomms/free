import type { PageServerLoad } from "./$types";
import { client } from "$lib/util/redis";
import { handle_server_error } from "$lib/util/handle_server_error";
import { user_index } from "$lib/constants";
import { escape_email } from "$lib/util/escape_email";

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.getSession()
    const user = await client.json.get(session?.user?.id ?? '');
    if (!user) throw handle_server_error(`expected to, but did not, find user with id ${session?.user?.id}`);
    return user
}