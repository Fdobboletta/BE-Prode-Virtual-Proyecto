import axios from 'axios';

import { nonNull, queryField } from 'nexus';

export const getPowerBiAccessToken = queryField('getPowerBiAccessToken', {
  type: nonNull('String'),
  resolve: async (_, args, ctx) => {
    try {
      const params = new URLSearchParams();

      params.append('client_id', process.env.POWER_BI_CLIENT_ID || '');
      params.append('client_secret', process.env.POWER_BI_CLIENT_SECRET || '');
      params.append('grant_type', 'password');
      params.append('resource', 'https://analysis.windows.net/powerbi/api');
      params.append('scope', 'openid');
      params.append('username', process.env.POWER_BI_USER || '');
      params.append('password', process.env.POWER_BI_PASS || '');
      const response = await axios.post(
        `https://login.microsoftonline.com/${process.env.POWER_BI_APP_ID}/oauth2/token`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data.access_token;
    } catch (error: any) {
      console.log('error', error);
      throw new Error(`Error al obtener el token: ${error.message}`);
    }
  },
});
