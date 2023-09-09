import axios from 'axios';
import { nonNull, queryField } from 'nexus';

export const getPowerBiAccessToken = queryField('getPowerBiAccessToken', {
  type: nonNull('String'),
  resolve: async (_, args, ctx) => {
    try {
      const params = new URLSearchParams();
      params.append('client_id', 'af3cfb14-a704-4f7b-8a45-61df2d20ca3c');
      params.append(
        'client_secret',
        'UmQ8Q~TJHwV0MUqmY1bx6v3JzaVWijt16TQ8Cbpf',
      );
      params.append('grant_type', 'client_credentials');
      params.append('scope', 'https://graph.microsoft.com/.default');

      const response = await axios.post(
        'https://login.microsoftonline.com/2dd23f82-d7a2-4f1a-85ff-622ebf7d878c/oauth2/v2.0/token',
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data.access_token;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  },
});
