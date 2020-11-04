import React, { FC, useState, useMemo } from 'react'
import { Switch } from 'antd'

import {
  useTenant,
  countProductPerCategory,
} from '../../../../../contexts/TenantContext'
import { useAltIntl } from '../../../../../intlConfig'
import { Section } from '../../../../../typings'
import SortableList from './SortableList'

type Props = {
  onSortedCategories: (indexeds: Array<Section<number>>) => void
}

const SortCategories: FC<Props> = ({ onSortedCategories }) => {
  const [{ tenant, products }] = useTenant()
  const intl = useAltIntl()
  const [isVisible, setIsVisible] = useState(true)

  // Not using the `visible` prop now, as we will implement it later
  const [categoryIds, setIds] = useState<Array<Section<number>>>(
    tenant?.sites?.zap.categoryIds ?? [] // session
  )

  // Used to get the products' count. It'd be great to have this on the Context, as we already
  // use it on the Categories component
  const productsCount = useMemo(() => {
    if (!products) return []

    return (
      tenant?.categories?.map((_, index) =>
        countProductPerCategory(index, products)
      ) ?? []
    )
  }, [tenant, products])

  const handleChecked = () => setIsVisible(!isVisible)

  return (
    <SortableList
      list={categoryIds}
      getIdFromItem={(item) => `${item.element}`}
      renderItem={(item) => (
        <div className="flex  items-center justify-center">
          <div className="flex flex-column items-baseline">
            <span className="fw6 f5">
              {tenant?.categories?.[item.element]?.name}
            </span>
            <span className="light-silver">
              {intl.formatMessage(
                { id: 'tenant.categories.productCount' },
                { count: `${productsCount[item.element]}` }
              )}
            </span>
          </div>
          {/* Use SwitchVisibility here, mutate the array, and call onSortedCategoried */}
          <Switch
            className="ml4"
            checkedChildren={() => {
              setIsVisible(isVisible)
              item.visible = isVisible
            }}
            unCheckedChildren={() => {
              setIsVisible(!isVisible)
              item.visible = isVisible
            }}
            defaultChecked
          />
        </div>
      )}
      onSortedList={(ids) => {
        setIds(ids)
        onSortedCategories(ids)
      }}
    />
  )
}

export default SortCategories
