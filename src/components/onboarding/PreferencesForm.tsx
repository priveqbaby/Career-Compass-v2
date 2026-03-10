import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"

interface PreferencesFormProps {
    onComplete: (preferences: { roles: string[]; industries: string[]; locations: string[] }) => void
    initialPreferences?: { roles: string[]; industries: string[]; locations: string[] }
}

const ROLE_SUGGESTIONS = [
    "Software Engineer",
    "Product Manager",
    "Data Scientist",
    "UX Designer",
    "Marketing Manager",
    "Sales Representative",
]

const INDUSTRY_SUGGESTIONS = [
    "Technology",
    "Finance",
    "Healthcare",
    "E-commerce",
    "Education",
    "Consulting",
]

const LOCATION_SUGGESTIONS = [
    "San Francisco, CA",
    "New York, NY",
    "Austin, TX",
    "Seattle, WA",
    "Remote",
    "Boston, MA",
]

export function PreferencesForm({ onComplete, initialPreferences }: PreferencesFormProps) {
    const [roles, setRoles] = useState<string[]>(initialPreferences?.roles || [])
    const [industries, setIndustries] = useState<string[]>(initialPreferences?.industries || [])
    const [locations, setLocations] = useState<string[]>(initialPreferences?.locations || [])

    const [roleInput, setRoleInput] = useState("")
    const [industryInput, setIndustryInput] = useState("")
    const [locationInput, setLocationInput] = useState("")

    const addItem = (value: string, list: string[], setter: (list: string[]) => void) => {
        if (value.trim() && !list.includes(value.trim())) {
            setter([...list, value.trim()])
        }
    }

    const removeItem = (value: string, list: string[], setter: (list: string[]) => void) => {
        setter(list.filter((item) => item !== value))
    }

    const handleSubmit = () => {
        onComplete({ roles, industries, locations })
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="roles">Preferred Roles</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                        What positions are you looking for?
                    </p>
                    <div className="flex gap-2 mb-3">
                        <Input
                            id="roles"
                            placeholder="e.g., Software Engineer"
                            value={roleInput}
                            onChange={(e) => setRoleInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    addItem(roleInput, roles, setRoles)
                                    setRoleInput("")
                                }
                            }}
                        />
                        <Button
                            type="button"
                            onClick={() => {
                                addItem(roleInput, roles, setRoles)
                                setRoleInput("")
                            }}
                        >
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {ROLE_SUGGESTIONS.map((role) => (
                            <Badge
                                key={role}
                                variant={roles.includes(role) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() =>
                                    roles.includes(role)
                                        ? removeItem(role, roles, setRoles)
                                        : addItem(role, roles, setRoles)
                                }
                            >
                                {role}
                            </Badge>
                        ))}
                    </div>
                    {roles.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {roles.map((role) => (
                                <Badge key={role} className="gap-1">
                                    {role}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => removeItem(role, roles, setRoles)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <Label htmlFor="industries">Industries</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                        Which industries interest you?
                    </p>
                    <div className="flex gap-2 mb-3">
                        <Input
                            id="industries"
                            placeholder="e.g., Technology"
                            value={industryInput}
                            onChange={(e) => setIndustryInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    addItem(industryInput, industries, setIndustries)
                                    setIndustryInput("")
                                }
                            }}
                        />
                        <Button
                            type="button"
                            onClick={() => {
                                addItem(industryInput, industries, setIndustries)
                                setIndustryInput("")
                            }}
                        >
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {INDUSTRY_SUGGESTIONS.map((industry) => (
                            <Badge
                                key={industry}
                                variant={industries.includes(industry) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() =>
                                    industries.includes(industry)
                                        ? removeItem(industry, industries, setIndustries)
                                        : addItem(industry, industries, setIndustries)
                                }
                            >
                                {industry}
                            </Badge>
                        ))}
                    </div>
                    {industries.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {industries.map((industry) => (
                                <Badge key={industry} className="gap-1">
                                    {industry}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => removeItem(industry, industries, setIndustries)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <Label htmlFor="locations">Locations</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                        Where would you like to work?
                    </p>
                    <div className="flex gap-2 mb-3">
                        <Input
                            id="locations"
                            placeholder="e.g., San Francisco, CA"
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    addItem(locationInput, locations, setLocations)
                                    setLocationInput("")
                                }
                            }}
                        />
                        <Button
                            type="button"
                            onClick={() => {
                                addItem(locationInput, locations, setLocations)
                                setLocationInput("")
                            }}
                        >
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {LOCATION_SUGGESTIONS.map((location) => (
                            <Badge
                                key={location}
                                variant={locations.includes(location) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() =>
                                    locations.includes(location)
                                        ? removeItem(location, locations, setLocations)
                                        : addItem(location, locations, setLocations)
                                }
                            >
                                {location}
                            </Badge>
                        ))}
                    </div>
                    {locations.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {locations.map((location) => (
                                <Badge key={location} className="gap-1">
                                    {location}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => removeItem(location, locations, setLocations)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Button
                onClick={handleSubmit}
                className="w-full"
                disabled={roles.length === 0 && industries.length === 0 && locations.length === 0}
            >
                Continue to Dashboard
            </Button>
        </div>
    )
}
