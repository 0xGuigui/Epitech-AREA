<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import {serverUrl, accessToken} from "../../../store";
    import {refreshAccessToken} from "../../utils/areaFetch";
    import Chart from 'svelte-frappe-charts';
    import Fa from "svelte-fa";
    import {icons} from "../../utils/fontAwesome";

    const MAX_CHART_POINTS = 10;

    let sse: EventSource;
    let chartRef: Chart;
    let chartRef2: Chart;
    let latestRawData;
    let apiData: any = {
        labels: ["Api"],
        datasets: [
            {
                name: 'Total requests',
                values: [0]
            },
            {
                name: '4XX - client',
                values: [0]
            },
            {
                name: '5XX - server',
                values: [0]
            },
        ],
        yMarkers: [{label: "Highest peak", value: 0}, {label: "Average", value: 0}],
    };
    let dbData = {
        labels: ['Database'],
        datasets: [
            {
                name: 'Total requests',
                values: [0]
            },
            {
                name: 'writing',
                values: [0]
            },
            {
                name: 'reading',
                values: [0]
            },
        ],
        yMarkers: [{label: "Highest peak", value: 0}, {label: "Average", value: 0}],
    };

    async function init() {
        if (!await refreshAccessToken($serverUrl)) {
            return;
        }

        sse = new EventSource($serverUrl + "/server-stream-events?token=" + $accessToken);
        sse.onmessage = function (event) {
            let rawData: object[] = JSON.parse(event.data);
            let newApiData = apiData;
            let newDbData = dbData;

            rawData.forEach((item) => {
                latestRawData = item;
                let date = new Date(item.date)

                newDbData.yMarkers[0].value = item.data.db.max
                newDbData.yMarkers[1].value = item.data.db.average
                newApiData.yMarkers[0].value = item.data.api.max
                newApiData.yMarkers[1].value = item.data.api.average
                newApiData.labels.push(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
                newApiData.datasets[0].values.push(item.data.api.total);
                newApiData.datasets[1].values.push(item.data.api['4xx']);
                newApiData.datasets[2].values.push(item.data.api['5xx']);
                newDbData.labels.push(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
                newDbData.datasets[0].values.push(item.data.db.total);
                newDbData.datasets[1].values.push(item.data.db.write);
                newDbData.datasets[2].values.push(item.data.db.read);
            });
            if (apiData.labels.length > MAX_CHART_POINTS) {
                apiData.labels = apiData.labels.slice(apiData.labels.length - MAX_CHART_POINTS);
                apiData.datasets[0].values = apiData.datasets[0].values.slice(apiData.datasets[0].values.length - MAX_CHART_POINTS);
                apiData.datasets[1].values = apiData.datasets[1].values.slice(apiData.datasets[1].values.length - MAX_CHART_POINTS);
                apiData.datasets[2].values = apiData.datasets[2].values.slice(apiData.datasets[2].values.length - MAX_CHART_POINTS);
                dbData.labels = dbData.labels.slice(dbData.labels.length - MAX_CHART_POINTS);
                dbData.datasets[0].values = dbData.datasets[0].values.slice(dbData.datasets[0].values.length - MAX_CHART_POINTS);
                dbData.datasets[1].values = dbData.datasets[1].values.slice(dbData.datasets[1].values.length - MAX_CHART_POINTS);
                dbData.datasets[2].values = dbData.datasets[2].values.slice(dbData.datasets[2].values.length - MAX_CHART_POINTS);
            }
            apiData = newApiData;
            dbData = newDbData;
        };
    }

    onMount(init);

    onDestroy(() => {
        if (sse) {
            sse.close();
        }
    })
</script>

<section class="pb-16">
    <div class="w-[1000px] mx-auto">
        <div class="flex items-center font-semibold text-xl ml-7 mt-12">
            <Fa icon={icons.faChartArea} class="mr-2"/>
            <span>API requests</span>
        </div>
        <Chart
                bind:this={chartRef}
                type="line"
                height={300}
                data={apiData}
                colors={['#1abc9c', '#fdcb6e', '#d63031']}
                lineOptions={{regionFill: 1}}
                tooltipOptions={{formatTooltipX: d => (new Date(d)).toLocaleString(), formatTooltipY: d => d}}
        />
        <div class="flex items-center font-semibold text-xl ml-7 mt-12">
            <Fa icon={icons.faDatabase} class="mr-2"/>
            <span>DB requests</span>
        </div>
        <Chart
                bind:this={chartRef2}
                type="line"
                height={300}
                data={dbData}
                colors={['#0984e3', '#e17055', '#00b894']}
                lineOptions={{regionFill: 1}}
                tooltipOptions={{formatTooltipX: d => (new Date(d)).toLocaleString(), formatTooltipY: d => d}}
        />
        <div class="flex items-center font-semibold text-xl ml-7 mt-12">
            <Fa icon={icons.faBook} class="mr-2"/>
            <span>Summary</span>
        </div>
        <div class="flex justify-between items-center w-full border-gray-300 border-[1px] mx-8 mt-5 rounded-sm py-4">
            <div class="flex justify-center items-center flex-1 w-full h-full">
                <div>
                    <Fa icon={icons.faUser} class="mx-auto mb-2" size="1.7x"/>
                    <span>{latestRawData?.data["usersCount"] || "0" } users</span>
                </div>
            </div>
            <div class="flex justify-center items-center flex-1 w-full h-full border-l-[1px] border-gray-300">
                <div>
                    <Fa icon={icons.faBolt} class="mx-auto mb-2" size="2x"/>
                    <span>{latestRawData?.data["actionsCount"] || "0" } active actions</span>
                </div>
            </div>
            <div class="flex justify-center items-center flex-1 w-full h-full border-l-[1px] border-gray-300">
                <div>
                    <Fa icon={icons.faPaperPlane} class="mx-auto mb-2" size="1.8x"/>
                    <span>{latestRawData?.data["servicesCount"] || "0" } active Services</span>
                </div>
            </div>
        </div>
    </div>
</section>