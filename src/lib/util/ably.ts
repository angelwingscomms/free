import { ABLY } from '$env/static/private';
import { index } from '$lib/constants';
import pkg from 'ably';

export const ably = new pkg.Realtime.Promise({ key: ABLY });

export const message_channel = ably.channels.get(index);
