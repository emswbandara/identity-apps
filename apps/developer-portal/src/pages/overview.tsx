/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { resolveUserDisplayName } from "@wso2is/core/helpers";
import { AlertLevels, ProfileInfoInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    Jumbotron,
    PageLayout,
    StatsInsightsWidget,
    StatsOverviewWidget
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Grid, Icon, Responsive } from "semantic-ui-react";
import { getApplicationList, getIdentityProviderList } from "../api";
import { ApplicationList, IdentityProviderList, handleGetIDPListCallError } from "../components";
import { OverviewPageIllustrations } from "../configs";
import { AppConstants, UIConstants } from "../constants";
import { history } from "../helpers";
import {
    ApplicationListInterface,
    FeatureConfigInterface,
    IdentityProviderListResponseInterface
} from "../models";
import { AppState } from "../store";

/**
 * Proptypes for the overview page component.
 */
type OverviewPageInterface = TestableComponentInterface;

/**
 * Overview page.
 *
 * @param {OverviewPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const OverviewPage: FunctionComponent<OverviewPageInterface> = (
    props: OverviewPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);

    const [ appList, setAppList ] = useState<ApplicationListInterface>({});
    const [ appCount, setAppCount ] = useState<number>(0);
    const [ idpList, setIdPList ] = useState<IdentityProviderListResponseInterface>({});
    const [ idpCount, setIdPCount ] = useState<number>(0);
    const [ isApplicationListRequestLoading, setApplicationListRequestLoading ] = useState<boolean>(false);
    const [ isIdPListRequestLoading, setIdPListRequestLoading ] = useState<boolean>(false);

    useEffect(() => {
        getAppLists(UIConstants.DEFAULT_STATS_LIST_ITEM_LIMIT , null, null);
        getIdPList(UIConstants.DEFAULT_STATS_LIST_ITEM_LIMIT , null, null);
    }, []);

    /**
     * Retrieves the list of applications.
     *
     * @param {number} limit - List limit.
     * @param {number} offset - List offset.
     * @param {string} filter - Search query.
     */
    const getAppLists = (limit: number, offset: number, filter: string): void => {
        setApplicationListRequestLoading(true);

        getApplicationList(limit, offset, filter)
            .then((response) => {
                setAppList(response);
                setAppCount(response?.totalResults);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("devPortal:components.applications.notifications.fetchApplications.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("devPortal:components.applications.notifications.fetchApplications" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("devPortal:components.applications.notifications.fetchApplications.genericError" +
                        ".message")
                }));
            })
            .finally(() => {
                setApplicationListRequestLoading(false);
            });
    };

    /**
     * Retrieves the list of identity providers.
     *
     * @param {number} limit - List limit.
     * @param {number} offset - List offset.
     * @param {string} filter - Search query.
     */
    const getIdPList = (limit: number, offset: number, filter: string): void => {
        setIdPListRequestLoading(true);

        getIdentityProviderList(limit, offset, filter)
            .then((response) => {
                setIdPList(response);
                setIdPCount(response?.totalResults);
            })
            .catch((error) => {
                handleGetIDPListCallError(error);
            })
            .finally(() => {
                setIdPListRequestLoading(false);
            });
    };

    const resolveGridContent = () => (
        <>
            <Grid.Column className="with-bottom-gutters">
                <StatsInsightsWidget
                    heading={ t("devPortal:components.overview.widgets.insights.applications.heading") }
                    subHeading={
                        t("devPortal:components.overview.widgets.insights.applications.subHeading")
                    }
                    primaryAction={ <><Icon name="location arrow"/>{ t("common:explore") }</> }
                    onPrimaryActionClick={
                        () => history.push(AppConstants.PATHS.get("APPLICATIONS"))
                    }
                    showExtraContent={
                        appList?.applications
                        && appList.applications instanceof Array
                        && appList.applications.length > 0
                    }
                >
                    <ApplicationList
                        selection
                        defaultListItemLimit={ UIConstants.DEFAULT_STATS_LIST_ITEM_LIMIT }
                        featureConfig={ featureConfig }
                        isLoading={ isApplicationListRequestLoading }
                        list={ appList }
                        onEmptyListPlaceholderActionClick={
                            () => history.push(AppConstants.PATHS.get("APPLICATIONS"))
                        }
                        showListItemActions={ false }
                        data-testid={ `${ testId }-list` }
                    />
                </StatsInsightsWidget>
            </Grid.Column>
            <Grid.Column className="with-bottom-gutters">
                <StatsInsightsWidget
                    heading={ t("devPortal:components.overview.widgets.insights.idp.heading") }
                    subHeading={
                        t("devPortal:components.overview.widgets.insights.idp.subHeading")
                    }
                    primaryAction={ <><Icon name="location arrow"/>{ t("common:explore") }</> }
                    onPrimaryActionClick={ () => history.push(AppConstants.PATHS.get("IDP")) }
                    showExtraContent={
                        idpList?.identityProviders
                        && idpList.identityProviders instanceof Array
                        && idpList.identityProviders.length > 0
                    }
                >
                    <IdentityProviderList
                        selection
                        defaultListItemLimit={ UIConstants.DEFAULT_STATS_LIST_ITEM_LIMIT }
                        isLoading={ isIdPListRequestLoading }
                        list={ idpList }
                        onEmptyListPlaceholderActionClick={
                            () => history.push(AppConstants.PATHS.get("IDP"))
                        }
                        showListItemActions={ false }
                        data-testid={ `${ testId }-list` }
                    />
                </StatsInsightsWidget>
            </Grid.Column>
        </>
    );

    return (
        <>
            <Jumbotron
                heading={ t(
                    "devPortal:pages.overview.title",
                    { firstName: resolveUserDisplayName(profileInfo as ProfileInfoInterface) }
                ) }
                subHeading={ t("devPortal:pages.overview.subTitle") }
                icon={ OverviewPageIllustrations.jumbotronIllustration }
                iconOptions={ {
                    fill: "primary"
                } }
            />
            <PageLayout
                contentTopMargin={ false }
                data-testid={ `${ testId }-page-layout` }
            >
                <StatsOverviewWidget
                    heading={ t("devPortal:components.overview.widgets.overview.heading") }
                    subHeading={ t("devPortal:components.overview.widgets.overview.subHeading") }
                    stats={ [
                        {
                            icon: OverviewPageIllustrations.statsOverview.application,
                            iconOptions: {
                                background: "accent1",
                                fill: "white"
                            },
                            label: t("devPortal:components.overview.widgets.overview.cards.applications.heading"),
                            value: appCount
                        },
                        {
                            icon: OverviewPageIllustrations.statsOverview.idp,
                            iconOptions: {
                                background: "accent2",
                                fill: "white"
                            },
                            label: t("devPortal:components.overview.widgets.overview.cards.idp.heading"),
                            value: idpCount
                        }
                    ] }
                />
                <Divider hidden/>
                <Grid>
                    <Responsive
                        as={ Grid.Row }
                        columns={ 2 }
                        minWidth={ Responsive.onlyComputer.minWidth }
                    >
                        { resolveGridContent() }
                    </Responsive>
                    <Responsive
                        as={ Grid.Row }
                        columns={ 1 }
                        maxWidth={ Responsive.onlyComputer.minWidth }
                    >
                        { resolveGridContent() }
                    </Responsive>
                </Grid>
            </PageLayout>
        </>
    );
};

/**
 * Default props for the component.
 */
OverviewPage.defaultProps = {
    "data-testid": "overview"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default OverviewPage;
