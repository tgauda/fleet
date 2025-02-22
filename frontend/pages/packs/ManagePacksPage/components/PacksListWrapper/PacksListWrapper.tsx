import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { IPack } from "interfaces/pack";
import { IUser } from "interfaces/user";
import Button from "components/buttons/Button";
import permissionUtils from "utilities/permissions";

import TableContainer from "components/TableContainer";
import { IActionButtonProps } from "components/TableContainer/DataTable/ActionButton";
import { generateTableHeaders, generateDataSet } from "./PacksTableConfig";

const baseClass = "packs-list-wrapper";
const noPacksClass = "no-packs";

interface IPacksListWrapperProps {
  onRemovePackClick: any;
  onEnablePackClick: any;
  onDisablePackClick: any;
  onCreatePackClick: any;
  packsList: IPack[];
}

interface IRootState {
  auth: {
    user: IUser;
  };
  entities: {
    packs: {
      isLoading: boolean;
      data: IPack[];
    };
  };
}

const PacksListWrapper = ({
  onRemovePackClick,
  onEnablePackClick,
  onDisablePackClick,
  onCreatePackClick,
  packsList,
}: IPacksListWrapperProps): JSX.Element => {
  const loadingTableData = useSelector(
    (state: IRootState) => state.entities.packs.isLoading
  );

  const currentUser = useSelector((state: IRootState) => state.auth.user);
  const isOnlyObserver = permissionUtils.isOnlyObserver(currentUser);

  const [filteredPacks, setFilteredPacks] = useState<IPack[]>(packsList);
  const [searchString, setSearchString] = useState<string>("");

  useEffect(() => {
    setFilteredPacks(packsList);
  }, [packsList]);

  useEffect(() => {
    setFilteredPacks(() => {
      return packsList.filter((pack) => {
        return pack.name.toLowerCase().includes(searchString.toLowerCase());
      });
    });
  }, [packsList, searchString, setFilteredPacks]);

  const onQueryChange = useCallback(
    (queryData) => {
      const { searchQuery } = queryData;
      setSearchString(searchQuery);
    },
    [setSearchString]
  );

  const NoPacksComponent = useCallback(() => {
    return (
      <div className={`${noPacksClass}`}>
        <div className={`${noPacksClass}__inner`}>
          <div className={`${noPacksClass}__inner-text`}>
            {!searchString ? (
              <>
                <h2>You don&apos;t have any packs</h2>
                <p>
                  Query packs allow you to schedule recurring queries for your
                  hosts.
                </p>
                <Button
                  variant="brand"
                  className={`${baseClass}__create-button`}
                  onClick={onCreatePackClick}
                >
                  Create new pack
                </Button>
              </>
            ) : (
              <>
                <h2>No packs match the current search criteria.</h2>
                <p>
                  Expecting to see packs? Try again in a few seconds as the
                  system catches up.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }, [searchString]);

  const tableHeaders = generateTableHeaders(isOnlyObserver);

  const secondarySelectActions: IActionButtonProps[] = [
    {
      name: "enable",
      onActionButtonClick: onEnablePackClick,
      buttonText: "Enable",
      variant: "text-icon",
      icon: "check",
    },
    {
      name: "disable",
      onActionButtonClick: onDisablePackClick,
      buttonText: "Disable",
      variant: "text-icon",
      icon: "disable",
    },
  ];
  return (
    <div className={`${baseClass}`}>
      <TableContainer
        resultsTitle={"packs"}
        columns={tableHeaders}
        data={generateDataSet(filteredPacks)}
        isLoading={loadingTableData}
        defaultSortHeader={"pack"}
        defaultSortDirection={"desc"}
        showMarkAllPages={false}
        isAllPagesSelected={false}
        onQueryChange={onQueryChange}
        inputPlaceHolder="Search by name"
        searchable={packsList.length > 0}
        disablePagination
        onPrimarySelectActionClick={onRemovePackClick}
        primarySelectActionButtonVariant="text-icon"
        primarySelectActionButtonIcon="delete"
        primarySelectActionButtonText={"Delete"}
        secondarySelectActions={secondarySelectActions}
        emptyComponent={NoPacksComponent}
        isClientSideSearch
      />
    </div>
  );
};

export default PacksListWrapper;
