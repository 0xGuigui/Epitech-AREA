<script lang="ts">
    import {fade} from "svelte/transition";

    let sentences = [
        "Powerful",
        "Elegant",
        "Simple",
        "Fast",
        "Flexible",
        "Fun",
    ]
    let show = true;
    let sentence = sentences[Math.floor(Math.random() * sentences.length)]

    function changeSentence() {
        show = false;
        setTimeout(() => {
            let buffer = sentence;
            while (true) {
                sentence = sentences[Math.floor(Math.random() * sentences.length)]
                if (sentence != buffer) {
                    break;
                }
            }
            show = true;
        }, 800)
    }

    setInterval(changeSentence, 5000)
</script>

<section class="w-full flex flex-col justify-center items-center bg-area-header">
    <div class="mt-20 text-white font-bold text-4xl">Site powered by :</div>
    <div class="mt-10 flex items-center justify-center">
        <a href="https://svelte.dev/">
            <img src="/svelte.png" alt="Svelte logo" class="w-[120px]"/>
        </a>
        <div class="mx-10"></div>
        <a href="https://tailwindcss.com/">
            <img src="/tailwind.png" alt="Tailwind logo" class="w-[170px]">
        </a>
    </div>
    <div class:opacity-0={!show} class="transition-all duration-300 ease-in area-letter text-[120px] py-10 mb-10 px-4" style="font-family: 'Pacifico', cursive;">
        {sentence}
    </div>
</section>
