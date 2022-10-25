<script lang="ts">
	import { page } from "$app/stores";
	import { form, field } from "svelte-forms";
	import { fade } from "svelte/transition";

	let newPassword = field("newPassword", "");
	let confirmPassword = field("confirmPassword", "");
	let loading = false;
	let sent = false;
	let error = null;
	let recoverAccountForm = form(newPassword, confirmPassword);

	function submit() {
		if ($newPassword.value !== $confirmPassword.value) {
			error = "Passwords don't match";
			return;
		}
		loading = true;
		fetch("http://localhost:8080/reset-password/" + $page.params.token, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				newPassword: $newPassword.value
			})
		}).then((res) => {
			loading = false;
			if (res.status === 200) {
				sent = true;
				error = null;
			} else {
				error = "Something went wrong";
			}
		}).catch(() => {
			error = "An error occurred";
			loading = false;
		});
	}
</script>

<section class="w-full h-full flex justify-center items-center">
	<div class="w-[410px] h-[550px] bg-gray-200 rounded-2xl text-center px-6 flex items-center flex-col">
		<div class="text-3xl mt-6 mb-4 font-bold">Change password</div>
		{#if !sent}
			<div class="leading-tight">Please enter a new password for your account</div>
			<div class="rounded-full h-0.5 w-5/6 bg-gray-400 mx-auto my-8"></div>
			<label for="newPassword" class="text-left w-full">New password</label>
			<input type="password" id="newPassword" bind:value={$newPassword.value}>
			<label for="confirmPassword" class="text-left w-full">Confirm password</label>
			<input type="password" id="confirmPassword" bind:value={$confirmPassword.value}>
			<div class="w-full h-full flex flex-col justify-end items-center pb-2">
				<button class="w-72 h-14 bg-gray-500 text-white rounded-xl hover:scale-105 transition-all items-center"
						on:click={submit}>
					{#if loading}
						<img src="/loaders/three-dots.svg" alt="Loader" transition:fade={{duration: 200}} width="60px"
							 class="mx-auto">
					{:else}
						Submit
					{/if}
				</button>
				<div class="text-red-500 text-sm {error ? '' : 'invisible'}">{error}</div>
			</div>
		{:else}
			<div>Password changed</div>
		{/if}
	</div>
</section>
