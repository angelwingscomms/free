import { client } from "$lib/util/redis"
import { error } from "@sveltejs/kit"

export const load: PageServerLoad = async({ request, params }) => {
    const c = await client.json.get(params.id)
    if (!c) throw error(404, `character {$params.id} not found`)
    return { p: c.p, n: c.n}
}