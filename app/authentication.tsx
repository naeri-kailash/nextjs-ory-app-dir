'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Configuration, FrontendApi, Session, Identity } from '@ory/client';
import { edgeConfig } from '@ory/integrations/next';

const ory = new FrontendApi(new Configuration(edgeConfig));

const Authentication = () => {
  const router = useRouter();

  const [session, setSession] = useState<Session | undefined>();
  const [logoutUrl, setLogoutUrl] = useState<string | undefined>();

  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        // User has a session!
        setSession(data);
        // Create a logout url
        ory.createBrowserLogoutFlow().then(({ data }) => {
          setLogoutUrl(data.logout_url);
        });
      })
      .catch(() => {
        // Redirect to login page
        return router.push(edgeConfig.basePath + '/ui/login');
      });
  }, [router]);

  if (!session) {
    // Still loading
    return <div>Loading</div>;
  }
  return <div className="text-xl font-medium text-zinc-500">Home Home</div>;
};

export default Authentication;
