import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useOrganizationList } from '@clerk/clerk-react'

export const OrgControl = () => {
    const { orgId } = useParams();
    const { setActive } = useOrganizationList();

    useEffect(() => {
        if (!setActive || !orgId) return;   

        setActive({
            organization: orgId
        });
    }, [setActive, orgId]);


    return null;
}
