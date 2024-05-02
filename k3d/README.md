## Useful commands

* `k3d cluster create skafos -p "80:80@loadbalancer" -p "443:443@loadbalancer" -p "30880:30880@server:0" --volume '/tmp/data:/data'` 
