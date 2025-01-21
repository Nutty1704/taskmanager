import { OrganizationList } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { getTheme } from "@/src/lib/util";
import { useTheme } from '@/src/components/theme/theme-provider'
import Navbar from "../components/ui/Navbar";

export default function CreateOrganizationPage() {
    const { theme } = useTheme();
    const [variables, setVariables] = useState({});

    useEffect(() => {
        setVariables(getTheme());
    }, [theme]);

    return (
        <>
            <Navbar />
            <div className="mt-10 flex flex-1 items-center justify-center w-full">
                <OrganizationList
                    hidePersonal
                    afterCreateOrganizationUrl={(organization) => `/organization/${organization.id}`}
                    afterSelectOrganizationUrl={(organization) => `/organization/${organization.id}`}
                    appearance={{
                        variables: variables,
                        elements: {
                            button: 'text-muted-foreground hover:text-foreground',
                            userPreviewMainIdentifier: 'text-muted-foreground hover:text-foreground',

                        }
                    }}
                />
            </div>
        </>
    )
}