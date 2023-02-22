FROM node:14.18.1
ARG service_name=opensea-api

# RUN apt-get update && apt-get install -y --no-install-recommends apt-utils
# # required by electron
# RUN apt-get update && apt-get install -yq --no-install-suggests --no-install-recommends \
#     git libx11-xcb1 libxcb-dri3-0 libxtst6 libnss3 libatk-bridge2.0-0 libgtk-3-0 libxss1 libasound2 \
#     && apt-get clean && rm -rf /var/lib/apt/lists/*

# # required by extra libraries
# RUN apt-get update && apt-get install -y \
#     libusb-1.0-0 \
#     libusb-1.0-0-dev \
#     libdrm2 \
#     libgbm-dev \
#     libxshmfence-dev \
#     xvfb
WORKDIR /app
COPY package.json ./app
COPY . /app
RUN yarn install
RUN yarn ${service_name} build
WORKDIR /app/${service_name}
CMD yarn start