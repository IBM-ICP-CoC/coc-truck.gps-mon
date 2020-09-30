# coc-truck.gps-mon

Simulated GPS sensor monitoring service for IEAM demos.

This service simulates a GPS reading, and computes the current direction and 
speed.  All data is randomly generated.

Only the log is updated with the information.


```

docker login 

docker build -t ibmicpcoc/coc-truck.gps-mon_amd64:1.0.0 .

hzn exchange service publish -f svc_def.json

hzn exchange business addpolicy --json-file=bus_policy.json coc-truck.gps-mon_1.0.0

hzn service log coc-truck.gps.mon 

```