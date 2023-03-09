'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Configuration, FrontendApi, Session, Identity } from '@ory/client';
import { edgeConfig } from '@ory/integrations/next';

const ory = new FrontendApi(new Configuration(edgeConfig));

const Authentication = ({ children }: { children: React.ReactNode }) => {
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
  }, [router, session, logoutUrl]);

  if (!session) {
    // Still loading
    return <div>Loading</div>;
  }
  return <div>{children}</div>;
};

export default Authentication;
