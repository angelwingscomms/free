import type { PageServerLoad } from "./$types";
import { client } from "$lib/util/redis";
import { handle_server_error } from "$lib/util/handle_server_error";
import { user_index } from "$lib/constants";
import { escape_email } from "$lib/util/escape_email";

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.getSession()
    let e = escape_email(session?.user?.email)
    for (const k of await client.keys('user_*')) {
        const r = (await client.json.get(k, { path: '$.email' }))[0]
        if (e === r) console.log('s', e, r)
    }
    console.log(await client.ft.search(user_index, `@email:${escape_email(session?.user?.email)}`))
    const user = await client.json.get(session?.user?.id ?? '');
    if (!user) throw handle_server_error(`expected to, but did not, find user with id ${session?.user?.id}`);
    return user
}