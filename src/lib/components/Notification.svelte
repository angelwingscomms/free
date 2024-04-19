<script lang="ts">
	import { ToastNotification } from "carbon-components-svelte";
	import type { ToastNotificationProps } from "carbon-components-svelte/src/Notification/ToastNotification.svelte";
    export let level: number, props: ToastNotificationProps

</script>

<div class="all" style="z-index: {7777777 + level};">
    <ToastNotification on:close {...props} />
</div>

<style lang="sass">
    @use '@carbon/layout'
    .all
        position: absolute
        top: layout.$spacing-09
        right: layout.$spacing-02
</style>