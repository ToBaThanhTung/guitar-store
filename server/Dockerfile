FROM node:12.18.1-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY . .

RUN yarn

# Development
CMD [ "yarn", "dev" ]

# RUN yarn add -g pm2
# Production

# CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]

