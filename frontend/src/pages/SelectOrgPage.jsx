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
            <div className="relative w-full">
                <div className="absolute top-32 left-0 w-full flex justify-center">
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
            </div>
        </>
    )
}