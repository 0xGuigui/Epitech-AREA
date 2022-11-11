<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import {serverUrl, accessToken} from "../../../store";
    import {refreshAccessToken} from "../../utils/areaFetch";
    import Chart from 'svelte-frappe-charts';
    import Fa from "svelte-fa";
    import {icons} from "../../utils/fontAwesome";

    let sse: EventSource;
    let maxBufferedData = 10;
    let chartRef: Chart;
    let chartRef2: Chart;
    let latestRawData;
    let data = {
        labels: ['_'],
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
        yMarkers: [{ label: "Highest peak", value: 0 }, { label: "Average", value: 0 }],
    };
    let data2 = {
        labels: ['_'],
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
        yMarkers: [{ label: "Highest peak", value: 0 }, { label: "Average", value: 0 }],
    };

    async function init() {
        if (!await refreshAccessToken($serverUrl)) {
            return;
        }

        sse = new EventSource($serverUrl + "/server-stream-events?token=" + $accessToken);
        sse.onmessage = function (event) {
            let rawData: object[] = JSON.parse(event.data);
            let newData = data
            let newData2 = data2

            rawData.forEach((item) => {
                latestRawData = item;
                let date = new Date(item.date)

                newData2.yMarkers[0].value = item.data.db.max
                newData2.yMarkers[1].value = item.data.db.average
                newData.yMarkers[0].value = item.data.api.max
                newData.yMarkers[1].value = item.data.api.average
                newData.labels.push(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
                newData.datasets[0].values.push(item.data.api.total);
                newData.datasets[1].values.push(item.data.api['4xx']);
                newData.datasets[2].values.push(item.data.api['5xx']);
                if (newData.labels.length > maxBufferedData) {
                    newData.labels.shift();
                    newData.datasets[0].values.shift();
                    newData.datasets[1].values.shift();
                    newData.datasets[2].values.shift();
                }
                newData2.labels.push(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
                newData2.datasets[0].values.push(item.data.db.total);
                newData2.datasets[1].values.push(item.data.db.write);
                newData2.datasets[2].values.push(item.data.db.read);
                if (newData2.labels.length > maxBufferedData) {
                    newData2.labels.shift();
                    newData2.datasets[0].values.shift();
                    newData2.datasets[1].values.shift();
                    newData2.datasets[2].values.shift();
                }
            });
            data = newData;
            data2 = newData2;
        };
    }

    onMount(init);

    onDestroy(() => {
        if (sse) {
            sse.close();
        }
    })
</script>

<section class="pt-8 pb-16">
    <div class="w-[1000px] mx-auto">
        <div class="flex items-center font-semibold text-xl ml-7">
            <Fa icon={icons.faChartArea} class="mr-2"/>
            <span>API requests</span>
        </div>
        <Chart
                bind:this={chartRef}
                type="line"
                height={300}
                data={data}
                colors={['#1abc9c', '#fdcb6e', '#d63031']}
                lineOptions={{regionFill: 1}}
                tooltipOptions={{formatTooltipX: d => (new Date(d)).toLocaleString(), formatTooltipY: d => d}}
        />
        <div class="flex items-center font-semibold text-xl ml-7 mt-8">
            <Fa icon={icons.faDatabase} class="mr-2"/>
            <span>DB requests</span>
        </div>
        <Chart
                bind:this={chartRef2}
                type="line"
                height={300}
                data={data2}
                colors={['#0984e3', '#e17055', '#00b894']}
                lineOptions={{regionFill: 1}}
                tooltipOptions={{formatTooltipX: d => (new Date(d)).toLocaleString(), formatTooltipY: d => d}}
        />
        <div class="flex items-center font-semibold text-xl ml-7 mt-8">
            <Fa icon={icons.faBook} class="mr-2"/>
            <span>Summary</span>
        </div>
        <div class="flex justify-between items-center w-full border-[1px] mx-8 mt-4 rounded-sm">
            <div class="relative w-1/2">
                <Chart
                        type="pie"
                        height={300}
                        data={{
                            labels: ['Total requests', '4XX - client', '5XX - server'],
                            datasets: [
                                {
                                    values: [1, 12, 34]
                                }
                            ]
                        }}
                        colors={['#1abc9c', '#fdcb6e', '#d63031']}
                />
            </div>
            <div class="relative border-l-[1px] w-1/2">
                <Chart
                        type="pie"
                        height={300}
                        data={{
                            labels: ['Total requests', '4XX - client', '5XX - server'],
                            datasets: [
                                {
                                    values: [1, 12, 34]
                                }
                            ]
                        }}
                        colors={['#1abc9c', '#fdcb6e', '#d63031']}
                />
            </div>
        </div>
        <div class="flex justify-between items-center w-full h-20 border-gray-300 border-[1px] border-t-0 mx-8 rounded-sm">
            <div class="flex-1 w-full h-full">
                <div>{latestRawData?.data["usersCount"] || "0" }</div>
                <div>
                    <Fa icon={icons.faUser} class="mr-2"/>
                    <span>Users</span>
                </div>
            </div>
            <div class="flex-1 w-full h-full border-l-[1px] border-gray-300">
                <div>{latestRawData?.data["actionsCount"] || "0" }</div>
                <div>
                    <Fa icon={icons.faUser} class="mr-2"/>
                    <span>Actions</span>
                </div>
            </div>
            <div class="flex-1 w-full h-full border-l-[1px] border-gray-300">
                <div>{latestRawData?.data["servicesCount"] || "0" }</div>
                <div>
                    <Fa icon={icons.faServicestack} class="mr-2"/>
                    <span>Services</span>
                </div>
            </div>
        </div>
    </div>
</section>