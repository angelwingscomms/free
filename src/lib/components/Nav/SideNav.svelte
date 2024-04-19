<script>
	import { SideNav, SideNavItems } from 'carbon-components-svelte';
	import SideNavLink from './SideNavLink.svelte';
	import { page } from '$app/stores';

	import { isSideNavOpen } from './store';

	import A2HsLink from './A2HSLink.svelte';
</script>

<SideNav bind:isOpen={$isSideNavOpen}>
	<SideNavItems>
		{#if $page.data.user}
			<SideNavLink text="WhatsApp groups" href="/wg" />
			<SideNavLink text="profile" href="/user/{$page.data.user}" />
			<SideNavLink text="users similar to you" href="/user/{$page.data.user}/similar" />
		{/if}
		
		 <!-- <SideNavLink text="messages" href="/m" /> -->
		 <SideNavLink text="feedback" href="/feedback" />
		<A2HsLink />
	</SideNavItems>
</SideNav>
