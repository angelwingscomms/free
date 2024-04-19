import { browser } from '$app/environment';
import { arrayStore } from '$lib/util/store';
import type { ToastNotificationProps } from 'carbon-components-svelte/src/Notification/ToastNotification.svelte';

export const notify = (message: string | ToastNotificationProps) => {
	if (browser) {
		const n: ToastNotificationProps = typeof message === 'string' ? { title: message } : message;
		n.caption = new Date().toLocaleString();
		if (!n.kind) n.kind = 'success'
		if (!n.timeout) n.timeout = n.kind === 'success' ? 432 : 4320
		n.lowContrast = true
		notifications.update((ns) => [...ns, n]);
	}
};

export const notifications = arrayStore<ToastNotificationProps>('notifications');
