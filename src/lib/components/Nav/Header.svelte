<script lang="ts">
	import { navigating, page } from '$app/stores';
	import { isSideNavOpen } from './store';
	import {
		InlineLoading,
		SkipToContent,
		Header,
		HeaderUtilities,
		HeaderAction,
		HeaderPanelLinks,
		HeaderPanelLink,
	} from 'carbon-components-svelte';
	import Sun from 'carbon-icons-svelte/lib/Sun.svelte';
	import Moon from 'carbon-icons-svelte/lib/Moon.svelte';
	import { theme } from '$lib/theme_store';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';

	$: isOpen = false;
	$: icon = $theme === 'g100' ? Sun : Moon;

	const provider_names = {
		google: 'Google',
		github: 'Github'
}
</script>

<Header
	persistentHamburgerMenu={true}
	platformName="Search"
	bind:isSideNavOpen={$isSideNavOpen}
	href="/"
>
	{#if $navigating}
		<InlineLoading />
	{/if}
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<HeaderAction
			on:click={(e) => {
				$theme = $theme === 'g100' ? 'white' : 'g100';
			}}
			on:open={(e) => {
				isOpen = false;
			}}
			bind:isOpen
			{icon}
			closeIcon={icon}
		/>
		<HeaderAction icon={UserAvatarFilledAlt} closeIcon={UserAvatarFilledAlt}>
			<HeaderPanelLinks>
				{#if $page.data.session?.user}
					<HeaderPanelLink on:click={() => signOut()}>Logged in with: {provider_names[$page.data.session.user.provider]}</HeaderPanelLink>
					<HeaderPanelLink on:click={() => signOut()}>Log out</HeaderPanelLink>
				{:else}
					<HeaderPanelLink on:click={() => signIn('github')}>Sign in with Github</HeaderPanelLink>
					<HeaderPanelLink on:click={() => signIn('google')}>Sign in with Google</HeaderPanelLink>
				{/if}
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>