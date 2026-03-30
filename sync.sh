

# keep things in sync. I can't get simlinks to work without link errors.    
# so this is the next best thing.
# this is a bit of a hack, but it works.

# fix this one: 
# ../../Documents/workspace/knotfree-net-homepage/src/knotfree-ts-lib

# ../knotfree-local-hoster/src  /Users/awootton/workspace/knotfree-local-hoster/src/App.tsx

mkdir -p ../WorldsTest1/src/knotfree-ts-lib/3d
mkdir -p ../offscreen-canvas-demo/src/knotfree-ts-lib/3d
mkdir -p ../three-demo-ts/src/knotfree-ts-lib/3d

while true; do
    rsync -avu src/ ../my-dummy-app/src/knotfree-ts-lib 
    rsync -avu src/ ../../Documents/workspace/knotfree-net-homepage/src/knotfree-ts-lib 
    rsync -avu src/ ../knotfree-local-hoster/src/knotfree-ts-lib 
    rsync -avu src/3d/ ../WorldsTest1/src/knotfree-ts-lib/3d
    rsync -avu src/3d/ ../offscreen-canvas-demo/src/knotfree-ts-lib/3d 
    rsync -avu src/3d/ ../three-demo-ts/src/knotfree-ts-lib/3d 

    rsync -avu ../my-dummy-app/src/knotfree-ts-lib/ src 
    rsync -avu ../../Documents/workspace/knotfree-net-homepage/src/knotfree-ts-lib/ src 
    rsync -avu ../knotfree-local-hoster/src/knotfree-ts-lib/ src 
    rsync -avu ../WorldsTest1/src/knotfree-ts-lib/3d/ src/3d
    rsync -avu ../offscreen-canvas-demo/src/knotfree-ts-lib/3d/ src/3d
    rsync -avu ../three-demo-ts/src/knotfree-ts-lib/3d/ src/3d
    sleep 5
    echo "Sync complete. Waiting for changes..."
done

