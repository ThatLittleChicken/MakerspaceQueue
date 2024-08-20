while getopts k:h:s: flag
do
    case "${flag}" in
        k) key=${OPTARG};;
        h) hostname=${OPTARG};;
        s) service=${OPTARG};;
    esac
done

if [[ -z "$key" || -z "$hostname" || -z "$service" ]]; then
    printf "\nMissing required parameter.\n"
    printf "  syntax: deployService.sh -k <pem key file> -h <hostname> -s <service>\n\n"
    exit 1
fi

printf "\n----> Deploying $service to $hostname with $key\n"

# Step 1
printf "\n----> Build the distribution package\n"
rm -rf dist
mkdir dist
cp -r public dist
cp *.json dist
cp *.js dist
cp .env dist

# Step 2
printf "\n----> Clearing out previous distribution on the target\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
rm -rf ${service}
mkdir -p ${service}
ENDSSH

# Step 3
printf "\n----> Copy the distribution package to the target\n"
scp -r -i "$key" dist/. ubuntu@$hostname:$service

# Step 4
printf "\n----> Deploy the service on the target\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
bash -i
cd ${service}
npm install
pm2 restart ${service}
ENDSSH

# Step 5
printf "\n----> Removing local copy of the distribution package\n"
rm -rf dist

#./deployService.sh -k ~/prod.pem -h yourdomain.com -s appname
#./deployService.sh -k ~/.ssh/AWSQueueAutomator.pem -h 35.153.196.169 -s queue-automator 