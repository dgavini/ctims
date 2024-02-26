import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {TabPanel, TabView} from "primereact/tabview";
import IdleComponent from "../../components/IdleComponent";
import TopBar from "../../components/trials/TopBar";
import styles from './index.module.scss';
import Trials from '../../components/trials/Trials';
import Results from '../../components/trials/Results';
import FooterComponent from "apps/web/components/FooterComponent";

const Main = () => {

  const {data, status: sessionStatus} = useSession()

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!data) {
      return;
    }
    localStorage.setItem('ctims-accessToken', data['accessToken'] as string);
    console.log('data', data)

    setActiveTab(0);
  }, [data])

  return (
    <>
      <div className={styles.container}>
        <IdleComponent />
        {sessionStatus === 'loading' && <div>Loading...</div>}
        {sessionStatus === 'authenticated' && <>
          <TopBar/>
          <div className={styles.pageContainer}>
            <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
              <TabPanel header="Trials">
                <Trials/>
              </TabPanel>
              <TabPanel header="Results">
                <Results/>
              </TabPanel>
            </TabView>
          </div>
          <FooterComponent/>
        </>}
        { sessionStatus === 'unauthenticated' && <div>Please log in to view this page.</div>}
      </div>
    </>
  );
}
export default Main;
