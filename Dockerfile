FROM node:22.21.1-alpine

RUN apk add --no-cache bash
RUN npm i -g @nestjs/cli typescript ts-node pnpm

COPY package*.json /tmp/app/
RUN cd /tmp/app && npm install

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app
COPY ./wait-for-it.sh /opt/wait-for-it.sh
RUN chmod +x /opt/wait-for-it.sh
COPY ./startup.relational.prod.sh /opt/startup.relational.prod.sh
RUN chmod +x /opt/startup.relational.prod.sh
COPY ./startup.admin.sh /opt/startup.admin.sh
RUN chmod +x /opt/startup.admin.sh
RUN sed -i 's/\r//g' /opt/wait-for-it.sh
RUN sed -i 's/\r//g' /opt/startup.relational.prod.sh
RUN sed -i 's/\r//g' /opt/startup.admin.sh

WORKDIR /usr/src/app
RUN if [ ! -f .env ]; then cp env-example-relational .env; fi
RUN npm run build

ENTRYPOINT ["/opt/startup.relational.prod.sh"]
