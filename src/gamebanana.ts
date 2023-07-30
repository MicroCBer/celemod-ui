export interface GBMod {
    _idRow: number;
    _nStatus?: string;
    _bIsPrivate?: boolean;
    _tsDateModified: number;
    _tsDateAdded: number;
    _sProfileUrl: string;
    _aPreviewMedia: APreviewMedia;
    _bIsFlagged?: boolean;
    _sCommentsMode?: string;
    _bAccessorIsSubmitter?: boolean;
    _bIsTrashed?: boolean;
    _bIsWithheld?: boolean;
    _sName: string;
    _nUpdatesCount?: number;
    _bHasUpdates?: boolean;
    _nAllTodosCount?: number;
    _bHasTodos?: boolean;
    _nPostCount: number;
    _aAttributes?: AAttributes;
    _aTags: Array<ATagClass | string>;
    _bCreatedBySubmitter?: boolean;
    _bIsPorted?: boolean;
    _nThanksCount?: number;
    _sInitialVisibility: string;
    _sDownloadUrl?: string;
    _nDownloadCount?: number;
    _aFiles?: AFile[];
    _nSubscriberCount?: number;
    _aContributingStudios?: any[];
    _sLicense?: string;
    _aLicenseChecklist?: ALicenseChecklist;
    _sDescription?: string;
    _bGenerateTableOfContents?: boolean;
    _sText?: string;
    _bIsObsolete: boolean;
    _nLikeCount: number;
    _nViewCount: number;
    _sVersion: string;
    _bAcceptsDonations?: boolean;
    _bShowRipePromo?: boolean;
    _aEmbeddables?: AEmbeddables;
    _aSubmitter: ASubmitter;
    _aGame: AGame;
    _aCategory?: Category;
    _aSuperCategory?: Category;
    _aFeaturings?: AFeaturings;
    _aCredits?: ACredit[];
    _aRequirements?: Array<string[]>;
    _sModelName?: string;
    _sSingularTitle?: string;
    _sIconClasses?: string;
    _bHasFiles?: boolean;
    _aRootCategory?: ARootCategory;
    _bHasContentRatings?: boolean;
    _bWasFeatured?: boolean;
    _bIsOwnedByAccessor?: boolean;
}

export interface AAttributes {
    Miscellaneous: string[];
}

export interface Category {
    _idRow: number;
    _sName: string;
    _sModelName: string;
    _sProfileUrl: string;
    _sIconUrl: string;
}

export interface ACredit {
    _sGroupName: string;
    _aAuthors: AAuthor[];
}

export interface AAuthor {
    _sRole: string;
    _idRow: number;
    _sName: string;
    _sUpicUrl: string;
    _sProfileUrl: string;
    _bIsOnline: boolean;
}

export interface AEmbeddables {
    _sEmbeddableImageBaseUrl: string;
    _aVariants: string[];
}

export interface AFeaturings {
    "3day": Day;
    yesterday: Day;
    today: Day;
}

export interface Day {
    _sFeatureGroup: string;
    _sTitle: string;
    _sIconClasses: string;
    _tsDate: number;
}

export interface AFile {
    _idRow: number;
    _sFile: string;
    _nFilesize: number;
    _sDescription: string;
    _tsDateAdded: number;
    _nDownloadCount: number;
    _sAnalysisState: string;
    _sDownloadUrl: string;
    _sMd5Checksum: string;
    _sClamAvResult: string;
    _sAnalysisResult: string;
    _bContainsExe: boolean;
    _aModManagerIntegrations: AModManagerIntegration[];
}

export interface AModManagerIntegration {
    _idToolRow: number;
    _aGameRowIds: number[];
    _sInstallerName: string;
    _sInstallerUrl: string;
    _sIconUrl: string;
    _sDownloadUrl: string;
}

export interface AGame {
    _idRow: number;
    _sName: string;
    _sAbbreviation?: string;
    _sProfileUrl: string;
    _sIconUrl: string;
    _sBannerUrl?: string;
    _nSubscriberCount?: number;
    _bHasSubmissionQueue?: boolean;
    _bAccessorIsSubscribed?: boolean;
}

export interface ALicenseChecklist {
    yes: string[];
    ask: string[];
    no: string[];
}

export interface APreviewMedia {
    _aImages: AImage[];
}

export interface AImage {
    _sType: SType;
    _sBaseUrl: string;
    _sFile: string;
    _sFile220?: string;
    _hFile220?: number;
    _wFile220?: number;
    _sFile530?: string;
    _hFile530?: number;
    _wFile530?: number;
    _sFile100: string;
    _hFile100: number;
    _wFile100: number;
    _sFile800?: string;
    _hFile800?: number;
    _wFile800?: number;
}

export enum SType {
    Screenshot = "screenshot",
}

export interface ARootCategory {
    _sName: string;
    _sProfileUrl: string;
    _sIconUrl: string;
}

export interface ASubmitter {
    _idRow: number;
    _sName: string;
    _sUserTitle?: string;
    _sHonoraryTitle?: string;
    _tsJoinDate?: number;
    _sAvatarUrl: string;
    _sSigUrl?: string;
    _sProfileUrl: string;
    _sPointsUrl?: string;
    _sMedalsUrl?: string;
    _bIsOnline: boolean;
    _sLocation?: string;
    _sOnlineTitle?: string;
    _sOfflineTitle?: string;
    _nPoints?: number;
    _nPointsRank?: number;
    _aNormalMedals?: Array<Array<number | string>>;
    _aRareMedals?: Array<Array<number | string>>;
    _aLegendaryMedals?: any[];
    _bHasRipe: boolean;
    _sSubjectShaperCssCode: string;
    _sCooltipCssCode?: string;
    _nBuddyCount?: number;
    _nSubscriberCount?: number;
    _aDonationMethods?: any[];
    _bAccessorIsBuddy?: boolean;
    _bBuddyRequestExistsWithAccessor?: boolean;
    _bAccessorIsSubscribed?: boolean;
    _sUpicUrl: string;
}

export interface ATagClass {
    _sValue: string;
}

export const enum CategoryEnum {
    Maps = 6800
}

export const getMods = (page: number, filters: {
    category?: number,
}) => {
    return fetch(`https://gamebanana.com/apiv11/Mod/Index?_nPage=${page}&_nPerpage=20&${filters.category ? `_aFilters%5BGeneric_Category%5D=${filters.category}&` : ""}_sSort=Generic_MostLiked`)
        .then(v => v.json())
        .then(v => v._aRecords as GBMod[])
}

export const getModDetail = (id: number) => {
    return fetch(`https://gamebanana.com/apiv11/Mod/${id}/ProfilePage`)
        .then(v => v.json()) as Promise<GBMod>
}
