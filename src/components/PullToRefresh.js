import React, {
  Component,
} from 'react'
import {
  ScrollView,
  StyleSheet,
  FlatList
} from 'react-native'


const styles = StyleSheet.create({
  header: {
      justifyContent: 'flex-end',
  },
  footer: {
      justifyContent: 'flex-start',
  },
  shrink: {
      height: 0,
  },
  marginVertical: {
      marginTop: 0,
      marginBottom: 0,
      marginVertical: 0,
  },
  paddingVertical: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingVertical: 0,
  }
})

class PullToRefreshListView extends Component {


  constructor (props) {
      super(props)
      this.state = {}
  }

  render () {
      return (
          this.props.viewType == viewType.scrollView ?
              <ScrollView
                  ref={ component => this._scrollView = component }
                  {...this.props}
                  style={[this.props.style, styles.paddingVertical,]}
                  contentContainerStyle={[this.props.contentContainerStyle, styles.marginVertical,]}
                  onLayout={this._onLayout}
                  onContentSizeChange={this._onContentSizeChange}
                  onResponderGrant={this._onResponderGrant}
                  onScroll={this._onScroll}
                  onMomentumScrollBegin={this._onResponderRelease}>
                  {this._renderHeader()}
                  {this.props.children}
                  {this._renderFooter()}
              </ScrollView> :
              <FlatList
                  ref={ component => this._scrollView = component }
                  {...this.props}
                  style={[this.props.style, styles.paddingVertical,]}
                  data={this.props.dataSource}
                  renderItem={this.props.renderRow}
                  ListHeaderComponent={this._renderHeader}
                  ListFooterComponent={this._renderFooter}
                  onEndReached={this.endRefresh}
                  onRefresh={this.beginRefresh}
                  />

      )
  }


  beginRefresh = (bounceDisabled) => {
      
  }

  endRefresh = (bounceDisabled) => {
     
  }

  endLoadMore = (loadedAll) => {
      //this._scrollView.setNativeProps({
      //    scrollEnabled: false
      //})

      let {load_more_none, loaded_all} = viewState
      let {autoLoadMore} = this.props
      if (!loadedAll) {
          this._loadMoreState = load_more_none
      }
      else {
          this._loadMoreState = loaded_all
      }
      this._footer.setState({
          pullState: this._loadMoreState,
      })

      if (!autoLoadMore) {
          this._loadMoreBackAnimating = true

          if (this._scrollY >= this._scrollViewContentHeight - this._scrollViewContainerHeight) {
              this.requestAnimationFrame(this._resetFooterLayout)
          }
          else {
              this._footer.setNativeProps({
                  style: {
                      //height: 0,
                      /**
                       * (occurs on react-native 0.32, and maybe also occurs on react-native 0.30+)ListView renderHeader/renderFooter => View's children cannot be visible when parent's height < StyleSheet.hairlineWidth
                       * ScrollView does not exist this strange bug
                       */
                      height: this._fixedBoundary,
                  }
              })
              this._scrollView.scrollTo({ y: this._scrollY, animated: false, })

              this._beginTimeStamp = null
              this._loadMoreBackAnimating = false
              this._afterLoadMoreBacked = true

              this._setPaddingBlank()

              this._scrollView.setNativeProps({
                  scrollEnabled: true,
              })
          }
      }
      else {
          this._setPaddingBlank()

          this._scrollView.setNativeProps({
              scrollEnabled: true,
          })
      }
  }


  //ensure that onContentSizeChange must be triggered while ending resetHeaderLayout/resetFooterLayout animation
  _onContentSizeChange = (contentWidth, contentHeight) => {
      let {refreshing, loading_more} = viewState
      if (this._scrollViewContentHeight == null
          || ((this._refreshState != refreshing && !this._refreshBackAnimating)
              //&& (this._loadMoreState != loading_more && !this._loadMoreBackAnimating))) {
          && ( this.props.autoLoadMore || (!this.props.autoLoadMore && this._loadMoreState != loading_more && !this._loadMoreBackAnimating) ))) {
          this._scrollViewContentHeight = contentHeight

          if (this._afterDirectRefresh) {
              this._afterDirectRefresh = false

              let {pullDownStayDistance} = this.props

              if (this._scrollY > this._scrollViewContentHeight - this._scrollViewContainerHeight + pullDownStayDistance) {
                  let y = this._scrollViewContentHeight - this._scrollViewContainerHeight
                  y = y > 0 ? y : 0
                  this._scrollView.scrollTo({
                      y,
                      animated: false,
                  })
                  //console.log(`_onContentSizeChange y = ${y} this._scrollY = ${this._scrollY} this._scrollViewContentHeight = ${this._scrollViewContentHeight}, this._scrollViewContainerHeight = ${this._scrollViewContainerHeight}`)
              }

              this._setPaddingBlank()
          }
      }

      this.props.onContentSizeChange && this.props.onContentSizeChange(contentWidth, contentHeight)
  }

  _onResponderGrant = (e) => {
      this._touching = true

      if (this._refreshBackAnimationFrame) {
          this.cancelAnimationFrame(this._refreshBackAnimationFrame)
          this._refreshBackAnimationFrame = null
          this._beginResetScrollTopTimeStamp = null

          if(!this._onRefreshed) {
              this._onRefreshed = true
              this.props.onRefresh && this.props.onRefresh()
          }
      }

      if (this._afterRefreshBacked) {
          this._afterRefreshBacked = false
      }
      if (this._afterLoadMoreBacked) {
          this._afterLoadMoreBacked = false
      }

      if (e.nativeEvent.contentOffset) {
          this._scrollY = e.nativeEvent.contentOffset.y
          this._lastScrollY = this._scrollY
      }

      let {refresh_idle, refreshing, load_more_idle, loading_more, loaded_all} = viewState
      let {enabledPullUp, enabledPullDown, pullUpDistance, pullDownDistance, autoLoadMore, } = this.props
      if (enabledPullDown && this._refreshState != refreshing && this._loadMoreState != loading_more && this._scrollY < 0) {
          this._refreshState = refresh_idle
          this._header.setState({
              pullState: this._refreshState,
              pullDistancePercent: -this._scrollY / pullDownDistance,
          })
      }
      else {
          if (this._canLoadMore && !autoLoadMore && enabledPullUp && this._refreshState != refreshing && this._loadMoreState != loading_more && this._loadMoreState != loaded_all && this._scrollY > this._scrollViewContentHeight - this._scrollViewContainerHeight) {
              this._loadMoreState = load_more_idle
              this._footer.setState({
                  pullState: this._loadMoreState,
                  pullDistancePercent: (this._scrollY - this._scrollViewContentHeight + this._scrollViewContainerHeight) / pullUpDistance,
              })
          }
      }
  }

  _onScroll = (e) => {
    
  }

}

export default PullToRefreshListView
