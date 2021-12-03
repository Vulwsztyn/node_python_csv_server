import http from 'k6/http'
import { check } from 'k6'
import { Rate } from 'k6/metrics'

export let options = {
    stages: [
      { target: 200, duration: "5s" },
      { target: 200, duration: "5s" },
      { target: 0, duration: "5s" }
  ],
  thresholds: {
    check_failure_rate: [
      // Global failure rate should be 0%
      'rate==0',
      // Abort the test early if it climbs over 1%
      { threshold: 'rate<=0.01', abortOnFail: true },
    ],
  },
}

const failureRate = new Rate('check_failure_rate')
const sampleFiles = [...Array(6).keys()].map((i) => open(`./files/sample${i + 1}.csv`, 'b'))
const outputFiles = [...Array(6).keys()].map((i) => open(`./files/sample${i + 1}.csv`))
export default function () {
  const fileIndex = Math.floor(Math.random() * 6)
  const data = {
    file: http.file(sampleFiles[fileIndex], 'test.bin'),
  }
  const response = http.post('http://localhost:3000/api', data)
  const expected = outputFiles[fileIndex]
  const checkRes = check(response, {
    'status is 200': (r) => r.status === 200,
    'response is correct': (r) => r.body.toString().trim() == expected.trim(),
  })
  failureRate.add(!checkRes)
}
