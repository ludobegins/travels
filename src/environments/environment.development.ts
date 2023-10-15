import { config } from 'dotenv';

config();

export const environment = {
    mapbox: {
        accessToken: process.env['MAPBOX_ACCESS_TOKEN']
    }
};
