import Card from "components/card";
import { Link } from "react-router-dom";

const ModuleLanding = ({ title, description, items = [] }) => {
  return (
    <div className="flex flex-col gap-6">
      <Card extra="p-6">
        <p className="text-sm font-semibold uppercase text-gray-500 dark:text-white/70">
          Module
        </p>
        <p className="mt-1 text-2xl font-bold text-navy-700 dark:text-white">
          {title}
        </p>
        {description ? (
          <p className="mt-2 text-sm text-gray-600 dark:text-white/70">
            {description}
          </p>
        ) : null}
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Card key={item.name} extra="p-5">
            <p className="text-lg font-semibold text-navy-700 dark:text-white">
              {item.name}
            </p>
            {item.description ? (
              <p className="mt-2 text-sm text-gray-600 dark:text-white/70">
                {item.description}
              </p>
            ) : null}
            <div className="mt-4">
              <Link
                to={item.to}
                className="inline-flex items-center rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-600"
              >
                Open
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ModuleLanding;
