import { Globe, Search, Filter } from "lucide-react";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";
import { NeoInput } from "@/components/ui-custom/neo-input";
import {
  NeoSelect,
  NeoSelectContent,
  NeoSelectItem,
  NeoSelectTrigger,
  NeoSelectValue,
} from "@/components/ui-custom/neo-select";
import { NeoCheckbox } from "@/components/ui-custom/neo-checkbox";

export function MarketplaceHeader() {
  return (
    <>
      <NeoPageHeader
        className="relative z-20"
        containerClassName="max-w-7xl mx-auto w-full px-4 md:px-6 py-6 md:py-8"
        title="Expert Marketplace"
        icon={<Globe className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
        description={
          <span className="block max-w-2xl">
            Discover and hire the top 1% of AI and Tech talent globally. Filter
            by skills, rates, and reviews to find the perfect match for your
            project.
          </span>
        }
      />

      {/* Sticky Filter Bar */}
      <div className="border-t-2 border-border bg-secondary/30 p-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative w-full lg:w-96 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <NeoInput
              placeholder="Search by name, title, or keywords..."
              className="pl-9 h-10 focus-visible: text-xs"
            />
          </div>

          {/* Filters */}
          <div className="flex w-full overflow-x-auto no-scrollbar gap-3 pb-1 lg:pb-0 items-center">
            <NeoSelect defaultValue="all">
              <NeoSelectTrigger className="w-36 md:w-48 shrink-0 h-10 text-[0.625rem]">
                <Filter className="w-3 h-3 mr-2" />
                <NeoSelectValue placeholder="Category" />
              </NeoSelectTrigger>
              <NeoSelectContent>
                <NeoSelectItem value="all" className="text-[0.625rem]">
                  All Categories
                </NeoSelectItem>
                <NeoSelectItem value="ai" className="text-[0.625rem]">
                  AI / Machine Learning
                </NeoSelectItem>
                <NeoSelectItem value="data" className="text-[0.625rem]">
                  Data Science
                </NeoSelectItem>
                <NeoSelectItem value="web" className="text-[0.625rem]">
                  Web Development
                </NeoSelectItem>
              </NeoSelectContent>
            </NeoSelect>

            <NeoSelect defaultValue="any">
              <NeoSelectTrigger className="w-32 md:w-40 shrink-0 h-10 text-[0.625rem]">
                <NeoSelectValue placeholder="Hourly Rate" />
              </NeoSelectTrigger>
              <NeoSelectContent>
                <NeoSelectItem value="any" className="text-[0.625rem]">
                  Any Rate
                </NeoSelectItem>
                <NeoSelectItem value="tier1" className="text-[0.625rem]">
                  Under $20/hr
                </NeoSelectItem>
                <NeoSelectItem value="tier2" className="text-[0.625rem]">
                  $20 - $50/hr
                </NeoSelectItem>
                <NeoSelectItem value="tier3" className="text-[0.625rem]">
                  $50 - $100/hr
                </NeoSelectItem>
              </NeoSelectContent>
            </NeoSelect>

            <div className="flex items-center gap-2 shrink-0 ml-2">
              <NeoCheckbox
                id="online"
                className="data-[state=checked]:bg-green-500 data-[state=checked]:text-white data-[state=checked]:border-green-500"
              />
              <label
                htmlFor="online"
                className="font-bold text-[0.625rem] uppercase tracking-widest cursor-pointer text-muted-foreground hover:text-foreground"
              >
                Online Now
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
