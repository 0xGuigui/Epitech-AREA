<script>
	import "../app.css";
	let AOS;
	import { onMount } from 'svelte';

	onMount(async () => {
		AOS = (await import('aos')).default;
		AOS.init({
			once: 'true'
		});
	});
</script>

<slot />
