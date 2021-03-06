/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import {
    Button,
    Divider,
    Dropdown, DropdownItemProps,
    DropdownProps,
    Grid,
    Icon,
    PaginationProps,
    Popup
} from "semantic-ui-react";
import { Pagination } from "../components";

/**
 * List layout component Prop types.
 */
export interface ListLayoutPropsInterface extends PaginationProps, TestableComponentInterface {
    /**
     * Advance search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Extra CSS classes.
     */
    className?: string;
    /**
     * Left action panel component.
     */
    leftActionPanel?: ReactNode;
    /**
     * Limit for the list.
     */
    listItemLimit?: number;
    /**
     * Callback to be fired on page number change.
     * @param {React.MouseEvent<HTMLAnchorElement, MouseEvent>} event - Event.
     * @param {PaginationProps} data - Pagination data.
     */
    onPageChange: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: PaginationProps) => void;
    /**
     * Callback to be fired when the sort strategy is changed.
     * @param {React.SyntheticEvent<HTMLElement>} event - Event.
     * @param {DropdownProps} data - Metadata.
     */
    onSortStrategyChange?: (event: SyntheticEvent<HTMLElement>, data: DropdownProps) => void;
    /**
     * Callback to be fired when the sort order is changed.
     * @param {boolean} isAscending - Is the order ascending.
     */
    onSortOrderChange?: (isAscending: boolean) => void;
    /**
     * Flag to reset the pagination.
     */
    resetPagination?: boolean;
    /**
     * Right action panel component.
     */
    rightActionPanel?: ReactNode;
    /**
     * Flag to toggle pagination visibility.
     */
    showPagination?: boolean;
    /**
     * Flag to toggle top action panel visibility.
     */
    showTopActionPanel?: boolean;
    /**
     * Sort options.
     */
    sortOptions?: DropdownItemProps[];
    /**
     * Sort strategies.
     */
    sortStrategy?: DropdownItemProps;
    /**
     * Total size of the list.
     */
    totalListSize?: number;
}

/**
 * List layout.
 *
 * @param {React.PropsWithChildren<ListLayoutPropsInterface>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ListLayout: FunctionComponent<PropsWithChildren<ListLayoutPropsInterface>> = (
    props: PropsWithChildren<ListLayoutPropsInterface>
): ReactElement => {

    const {
        advancedSearch,
        children,
        className,
        leftActionPanel,
        listItemLimit,
        onPageChange,
        onSortStrategyChange,
        onSortOrderChange,
        resetPagination,
        rightActionPanel,
        showPagination,
        showTopActionPanel,
        sortOptions,
        sortStrategy,
        totalListSize,
        totalPages,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const [ isAscending, setIsAscending ] = useState(true);

    const classes = classNames(
        "layout",
        "list-layout",
        className
    );

    return (
        <div className={ classes } data-testid={ testId }>
            {
                showTopActionPanel && (
                    <>
                        <div className="top-action-panel" data-testid={ `${ testId }-top-action-panel` }>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={ 8 }>
                                        <div className="left-aligned actions">
                                            {
                                                sortOptions &&
                                                sortStrategy &&
                                                onSortStrategyChange &&
                                                onSortOrderChange &&
                                                <div className="sort-list">
                                                    <Dropdown
                                                        onChange={ onSortStrategyChange }
                                                        options={ sortOptions }
                                                        placeholder={ "Sort by" }
                                                        selection
                                                        value={
                                                            sortOptions?.length === 1
                                                                ? sortOptions[ 0 ].value
                                                                : sortStrategy.value
                                                        }
                                                        disabled={ sortOptions?.length === 1 }
                                                        data-testid={ `${ testId }-sort` }
                                                    />
                                                    <Popup
                                                        trigger={
                                                            <Button
                                                                icon
                                                                onClick={ () => {
                                                                    setIsAscending(!isAscending);
                                                                    onSortOrderChange(!isAscending);
                                                                } }
                                                                className="left-aligned-action"
                                                            >
                                                                <Icon
                                                                    name={
                                                                        isAscending
                                                                            ? "sort amount down"
                                                                            : "sort amount up"
                                                                    }
                                                                />
                                                            </Button>
                                                        }
                                                        content={
                                                            isAscending
                                                                ? "Sort in the descending order"
                                                                : "Sort in the ascending order"
                                                        }
                                                        inverted
                                                    />
                                                </div>
                                            }
                                        </div>
                                        <div className="left aligned-actions">
                                            { leftActionPanel }
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column width={ 8 }>
                                        <div className="actions right-aligned">
                                            { advancedSearch }
                                            { rightActionPanel }
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                        <Divider hidden/>
                    </>
                )
            }
            <div className="list-container">
                { children }
                {
                    (showPagination && totalListSize)
                        ? (
                            <Pagination
                                data-testid={ `${ testId }-pagination` }
                                resetPagination={ resetPagination }
                                totalListSize={ totalListSize }
                                totalPages={ totalPages }
                                onPageChange={ onPageChange }
                            />
                        )
                        : null
                }
            </div>
        </div>
    );
};

/**
 * Default props for the list layout.
 */
ListLayout.defaultProps = {
    "data-testid": "list-layout",
    showPagination: false,
    showTopActionPanel: true
};
