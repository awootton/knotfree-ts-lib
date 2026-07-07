

# keep things in sync. I can't get simlinks to work without link errors.    
# so this is the next best thing.
# this is a total hack, but it twerks.

# fix this one: 
# ../../Documents/workspace/knotfree-net-homepage/src/knotfree-ts-lib

# ../knotfree-local-hoster/src  /Users/awootton/workspace/knotfree-local-hoster/src/App.tsx

mkdir -p ../WorldsTest1/src/knotfree-ts-lib/3d
mkdir -p ../WorldsTest1/src/knotfree-ts-lib/components
# mkdir -p ../offscreen-canvas-demo/src/knotfree-ts-lib/3d
# mkdir -p ../three-demo-ts/src/knotfree-ts-lib/3d
mkdir -p ../metaverse-proto-one/src/knotfree-ts-lib/3d
mkdir -p ../metaverse-proto-one/src/knotfree-ts-lib/components

# I'm scared of this thing overwriting stuff. But I need something to keep things in sync.
# I can't get simlinks to work without link errors.

while true; do
    # rsync -avu src/ ../my-dummy-app/src/knotfree-ts-lib 
    
    rsync -avu src/ ../../Documents/workspace/knotfree-net-homepage/src/knotfree-ts-lib 
    rsync -avu ../../Documents/workspace/knotfree-net-homepage/src/knotfree-ts-lib/ src 

    rsync -avu src/ ../knotfree-local-hoster/src/knotfree-ts-lib 
    rsync -avu ../knotfree-local-hoster/src/knotfree-ts-lib/ src 

    echo rsync -avu src/3d/ ../WorldsTest1/src/knotfree-ts-lib/3d
         rsync -avu src/3d/ ../WorldsTest1/src/knotfree-ts-lib/3d
    echo rsync -avu ../WorldsTest1/src/knotfree-ts-lib/3d/ src/3d
         rsync -avu ../WorldsTest1/src/knotfree-ts-lib/3d/ src/3d

    # rsync -avu src/3d/ ../offscreen-canvas-demo/src/knotfree-ts-lib/3d 
    # rsync -avu src/3d/ ../three-demo-ts/src/knotfree-ts-lib/3d 
    # rsync -avu ../my-dummy-app/src/knotfree-ts-lib/ src 
    # rsync -avu ../offscreen-canvas-demo/src/knotfree-ts-lib/3d/ src/3d
    # rsync -avu ../three-demo-ts/src/knotfree-ts-lib/3d/ src/3d

    echo rsync -avu ../metaverse-proto-one/src/knotfree-ts-lib/3d/ src/3d
         rsync -avu ../metaverse-proto-one/src/knotfree-ts-lib/3d/ src/3d
    echo rsync -avu src/3d/ ../metaverse-proto-one/src/knotfree-ts-lib/3d
         rsync -avu src/3d/ ../metaverse-proto-one/src/knotfree-ts-lib/3d

    echo rsync -avu ../metaverse-proto-one/src/knotfree-ts-lib/components/ src/components
         rsync -avu ../metaverse-proto-one/src/knotfree-ts-lib/components/ src/components
    echo rsync -avu src/components/ ../metaverse-proto-one/src/knotfree-ts-lib/components
         rsync -avu src/components/ ../metaverse-proto-one/src/knotfree-ts-lib/components
    
    echo "Sync complete. Waiting for changes..."
    sleep 15
done

